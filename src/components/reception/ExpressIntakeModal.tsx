'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { WashOrder } from '@/lib/types';
import { X, Car, Bike, Truck, Sparkles, User, AlertCircle, PlusCircle, Check } from 'lucide-react';

interface ExpressIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: WashOrder) => void;
}

export function ExpressIntakeModal({ isOpen, onClose, onOrderCreated }: ExpressIntakeModalProps) {
  const { categories, services, rates, washers, orders, createOrder } = useApp();

  const [plate, setPlate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[1]?.id || '');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([services[0]?.id || '']);
  const [selectedWasherId, setSelectedWasherId] = useState('');
  const [notes, setNotes] = useState('');
  const [preExistingDamage, setPreExistingDamage] = useState('');

  if (!isOpen) return null;

  // Auto-fill customer if plate was seen before
  const handlePlateChange = (val: string) => {
    const formatted = val.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setPlate(formatted);

    const prevOrder = orders.find((o) => o.plate.replace(/[^A-Z0-9]/g, '') === formatted.replace(/[^A-Z0-9]/g, ''));
    if (prevOrder && prevOrder.customerName && !customerName) {
      setCustomerName(prevOrder.customerName);
      if (prevOrder.customerPhone && !customerPhone) setCustomerPhone(prevOrder.customerPhone);
      if (prevOrder.vehicleCategoryId) setSelectedCategoryId(prevOrder.vehicleCategoryId);
    }
  };

  const toggleService = (srvId: string) => {
    if (selectedServiceIds.includes(srvId)) {
      if (selectedServiceIds.length > 1) {
        setSelectedServiceIds(selectedServiceIds.filter((id) => id !== srvId));
      }
    } else {
      setSelectedServiceIds([...selectedServiceIds, srvId]);
    }
  };

  // Calculate prices based on selected category & services
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const calculatedItems = selectedServiceIds.map((sId) => {
    const service = services.find((s) => s.id === sId);
    const rate = rates.find((r) => r.serviceId === sId && r.vehicleCategoryId === selectedCategoryId);
    const price = rate?.price || 25000;
    const commissionType = rate?.commissionType || 'PERCENTAGE';
    const commissionVal = rate?.commissionValue || 40;
    const commissionTotal = commissionType === 'PERCENTAGE' ? (price * commissionVal) / 100 : commissionVal;

    return {
      id: `item-${Date.now()}-${sId}`,
      serviceId: sId,
      serviceName: service?.name || 'Servicio',
      price,
      commissionType,
      commissionValue: commissionTotal,
    };
  });

  const totalPrice = calculatedItems.reduce((acc, it) => acc + it.price, 0);
  const totalCommission = calculatedItems.reduce((acc, it) => acc + it.commissionValue, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim()) return;

    const assignedWasher = washers.find((w) => w.id === selectedWasherId);

    const newOrder = createOrder({
      plate: plate.trim(),
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      vehicleCategoryId: selectedCategoryId,
      vehicleCategoryName: selectedCategory?.name || 'Automóvil',
      washerId: selectedWasherId || undefined,
      washerName: assignedWasher?.name || undefined,
      status: 'WAITING',
      notes: notes.trim() || undefined,
      preExistingDamage: preExistingDamage.trim() || undefined,
      items: calculatedItems,
      totalAmount: totalPrice,
      washerCommissionTotal: totalCommission,
      paymentStatus: 'PENDING',
      paymentMethod: 'PENDING',
    });

    onOrderCreated(newOrder);
    onClose();
    // Reset form
    setPlate('');
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
    setPreExistingDamage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-5 sm:p-6 bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/30">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Recepción Express de Vehículo</h2>
              <p className="text-xs text-slate-400">Ingreso a patio y asignación de cola</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Placa & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Placa del Vehículo <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej. KZP-812"
                value={plate}
                onChange={(e) => handlePlateChange(e.target.value)}
                maxLength={8}
                className="w-full bg-slate-950 font-mono text-lg font-bold tracking-wider text-amber-400 px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 uppercase text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Vehículo</label>
              <div className="grid grid-cols-2 gap-1.5">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`px-2 py-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                      selectedCategoryId === cat.id
                        ? 'bg-brand-600/30 border-brand-500 text-brand-300 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{cat.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Cliente</label>
              <input
                type="text"
                placeholder="Opcional"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-950 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Celular (WhatsApp)</label>
              <input
                type="tel"
                placeholder="+57 300 000 0000"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-slate-950 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Services Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Servicio(s) Solicitados
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-1">
              {services.map((srv) => {
                const isSelected = selectedServiceIds.includes(srv.id);
                const rate = rates.find(
                  (r) => r.serviceId === srv.id && r.vehicleCategoryId === selectedCategoryId
                );
                const price = rate?.price || 25000;

                return (
                  <button
                    type="button"
                    key={srv.id}
                    onClick={() => toggleService(srv.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-brand-900/40 border-brand-500/80 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center border text-[10px] ${
                          isSelected ? 'bg-brand-500 border-brand-400 text-white' : 'border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-xs font-medium">{srv.name}</span>
                    </div>
                    <span className="text-xs font-bold text-accent-cyan">
                      ${price.toLocaleString('es-CO')} COP
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assigned Washer */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Asignar Operario / Lavador
            </label>
            <select
              value={selectedWasherId}
              onChange={(e) => setSelectedWasherId(e.target.value)}
              className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
            >
              <option value="">A la cola de espera (Sin asignar aún)</option>
              {washers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} (Comisión: {w.commissionType === 'PERCENTAGE' ? `${w.defaultCommissionValue}%` : `$${w.defaultCommissionValue.toLocaleString('es-CO')}`})
                </option>
              ))}
            </select>
          </div>

          {/* Damage / Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Observaciones de Estado / Rayones Previos
            </label>
            <input
              type="text"
              placeholder="Ej. Rayón en bomper trasero, sin antena..."
              value={preExistingDamage}
              onChange={(e) => setPreExistingDamage(e.target.value)}
              className="w-full bg-slate-950 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Price & Commission summary footer */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400">Total a cobrar:</span>
              <p className="font-extrabold text-base text-emerald-400">
                ${totalPrice.toLocaleString('es-CO')} COP
              </p>
            </div>
            <div className="text-right">
              <span className="text-slate-400">Comisión Lavador est.:</span>
              <p className="font-bold text-indigo-300">
                ${totalCommission.toLocaleString('es-CO')} COP
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 font-bold text-sm text-white shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            Registrar Ingreso y Generar Ticket
          </button>
        </form>
      </div>
    </div>
  );
}
