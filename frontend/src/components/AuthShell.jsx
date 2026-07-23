import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';

import ThreeDBackground from './ThreeDBackground';



export default function AuthShell({ title, subtitle, children, footer, sideTitle, sidePoints }) {

  return (

    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/30 to-slate-100">

      <ThreeDBackground variant="subtle" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-10 lg:flex-row lg:items-center lg:gap-10">

        <motion.div

          initial={{ opacity: 0, x: -24 }}

          animate={{ opacity: 1, x: 0 }}

          className="mb-8 w-full lg:mb-0 lg:w-[42%] lg:pr-4"

        >

          <div className="rounded-3xl bg-gradient-to-br from-brand-600 via-cyan-700 to-violet-800 p-8 text-white shadow-2xl sm:p-10">

            <Link to="/" className="text-2xl font-bold">Smart<span className="text-cyan-200">Roooms</span></Link>

            <h2 className="mt-8 text-2xl font-bold leading-tight sm:text-3xl">{sideTitle}</h2>

            <ul className="mt-8 space-y-4">

              {sidePoints.map((p, i) => (

                <motion.li

                  key={p}

                  initial={{ opacity: 0, x: -10 }}

                  animate={{ opacity: 1, x: 0 }}

                  transition={{ delay: 0.1 + i * 0.08 }}

                  className="flex items-start gap-3 text-sm text-white/90"

                >

                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs">✓</span>

                  <span>{p}</span>

                </motion.li>

              ))}

            </ul>

          </div>

        </motion.div>



        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          className="w-full lg:w-[58%]"

        >

          <div className="rounded-3xl border border-white/90 bg-white p-6 shadow-2xl shadow-brand-500/10 sm:p-10">

            <div className="mb-8 border-b border-gray-100 pb-6">

              <Link to="/" className="text-lg font-bold text-gray-900 lg:hidden">

                Smart<span className="text-brand-500">Roooms</span>

              </Link>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>

              {subtitle && <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">{subtitle}</p>}

            </div>

            {children}

            {footer}

          </div>

        </motion.div>

      </div>

    </div>

  );

}



export function FormField({ label, required, error, hint, children }) {

  return (

    <div className="form-group space-y-1.5">

      {label && (

        <label className="form-label block">

          {label}{required && <span className="text-red-500"> *</span>}

        </label>

      )}

      {children}

      {hint && !error && <p className="form-hint">{hint}</p>}

      {error && <p className="form-error">{error}</p>}

    </div>

  );

}



export function FormInput({ icon: Icon, className = '', rightSlot, ...props }) {

  return (

    <div className="relative">

      {Icon && (

        <Icon

          className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-gray-400"

          size={18}

        />

      )}

      <input

        className={`form-input w-full ${Icon ? 'pl-11' : ''} ${rightSlot ? 'pr-11' : ''} ${className}`}

        {...props}

      />

      {rightSlot && (

        <div className="absolute right-2 top-1/2 z-10 -translate-y-1/2">

          {rightSlot}

        </div>

      )}

    </div>

  );

}



export function FormSelect({ icon: Icon, className = '', children, ...props }) {

  return (

    <div className="relative">

      {Icon && (

        <Icon

          className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-gray-400"

          size={18}

        />

      )}

      <select className={`form-input w-full appearance-none ${Icon ? 'pl-11 pr-10' : 'pr-10'} ${className}`} {...props}>

        {children}

      </select>

    </div>

  );

}



export function FormButton({ loading, children, variant = 'primary', ...props }) {

  const styles = variant === 'secondary'

    ? 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'

    : 'bg-gradient-to-r from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-xl';

  return (

    <motion.button

      whileHover={{ scale: loading ? 1 : 1.01 }}

      whileTap={{ scale: loading ? 1 : 0.99 }}

      disabled={loading}

      className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles}`}

      {...props}

    >

      {children}

    </motion.button>

  );

}



export function FormAlert({ type = 'error', children }) {

  return (

    <motion.div

      initial={{ opacity: 0, y: -4 }}

      animate={{ opacity: 1, y: 0 }}

      className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${

        type === 'error' ? 'bg-red-50 text-red-700 ring-1 ring-red-100' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'

      }`}

    >

      {children}

    </motion.div>

  );

}



export function StepIndicator({ steps, current }) {

  return (

    <div className="mb-8 flex items-center justify-between gap-1">

      {steps.map((label, i) => (

        <div key={label} className="flex flex-1 flex-col items-center">

          <div

            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${

              i < current ? 'bg-emerald-500 text-white' : i === current ? 'bg-brand-500 text-white ring-4 ring-brand-100' : 'bg-gray-100 text-gray-400'

            }`}

          >

            {i < current ? '✓' : i + 1}

          </div>

          <span className={`mt-1 hidden text-[10px] font-medium sm:block ${i <= current ? 'text-brand-600' : 'text-gray-400'}`}>

            {label}

          </span>

        </div>

      ))}

    </div>

  );

}



export function RoleCard({ selected, onClick, icon: Icon, title, desc }) {

  return (

    <motion.button

      type="button"

      whileHover={{ scale: 1.02 }}

      whileTap={{ scale: 0.98 }}

      onClick={onClick}

      className={`w-full rounded-2xl border-2 p-5 text-left transition ${

        selected ? 'border-brand-500 bg-brand-50 shadow-md ring-2 ring-brand-100' : 'border-gray-200 hover:border-brand-200 hover:bg-gray-50'

      }`}

    >

      <Icon className={selected ? 'text-brand-600' : 'text-gray-400'} size={28} />

      <p className="mt-3 font-bold text-gray-900">{title}</p>

      <p className="mt-1 text-xs text-gray-500">{desc}</p>

    </motion.button>

  );

}



export function ChipToggle({ active, onClick, children }) {

  return (

    <button

      type="button"

      onClick={onClick}

      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${

        active ? 'bg-brand-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-700'

      }`}

    >

      {children}

    </button>

  );

}


