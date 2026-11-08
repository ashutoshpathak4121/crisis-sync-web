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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] p-6 shadow-xl text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200 dark:border-red-800/60">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold">Report Emergency Incident</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Incident Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none cursor-pointer"
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
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Severity Level</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="CRITICAL">CRITICAL (Code Red)</option>
                <option value="HIGH">HIGH (Code Orange)</option>
                <option value="MEDIUM">MEDIUM (Code Yellow)</option>
                <option value="LOW">LOW (Code Green)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Estimated Victims</label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.patientCount}
                onChange={(e) => setFormData({ ...formData, patientCount: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Field Situation Summary</label>
            <textarea
              required
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe scene conditions, entrapments, triage requirements..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Broadcasting...' : 'Broadcast Alert'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentReportModal;