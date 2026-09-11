import React, { useState } from 'react';
import { AlertCircle, X, Send } from 'lucide-react';

const IncidentReportModal = ({ isOpen, onClose, onSubmit, defaultCoordinates }) => {
  const [formData, setFormData] = useState({
    type: 'Multi-Vehicle Collision',
    severity: 'HIGH',
    description: '',
    patientCount: 1,
    latitude: defaultCoordinates?.lat || 28.5480,
    longitude: defaultCoordinates?.lng || 77.2450
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit({
        ...formData,
        patientCount: parseInt(formData.patientCount, 10),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      });
      onClose();
    } catch (err) {
      console.error('Failed to report incident:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-[#1E2E48] bg-[#0E1626] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="text-base font-bold text-white">Report Emergency Incident</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Incident Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-[#080C15] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option>Multi-Vehicle Collision</option>
              <option>Industrial Chemical Incident</option>
              <option>Structural Collapse</option>
              <option>Mass Casualty Explosion</option>
              <option>Severe Cardiac Emergency</option>
              <option>Respiratory Distress Outbreak</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Severity Level</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full bg-[#080C15] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="CRITICAL">CRITICAL (Code Red)</option>
                <option value="HIGH">HIGH (Code Orange)</option>
                <option value="MEDIUM">MEDIUM (Code Yellow)</option>
                <option value="LOW">LOW (Code Green)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Estimated Victims</label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.patientCount}
                onChange={(e) => setFormData({ ...formData, patientCount: e.target.value })}
                className="w-full bg-[#080C15] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Field Situation Summary</label>
            <textarea
              required
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe scene conditions, entrapments, triage requirements..."
              className="w-full bg-[#080C15] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wider disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Broadcasting...' : 'Broadcast to Command'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentReportModal;
