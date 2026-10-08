'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X } from 'lucide-react'

// Licenses activate per device (Licenses.allowed_devices, default 1); nothing in
// the app or the license API limits how many SQL Servers a device connects to.
// The Enterprise extras have no code behind them, so they are offered on request
// rather than listed as included. Checked against the API on 2026-10-08.
const plans = [
  {
    name: 'Developer',
    description: 'For individual developers and DBAs',
    monthlyPrice: 39,
    annualPrice: 402,
    annualMonthly: 33.50,
    features: [
      { text: '1 license, activated on one device', included: true },
      { text: 'No limit on the number of SQL Servers you connect to', included: true, bold: true },
      { text: 'All core modules', included: true },
      { text: 'Evidence reports with optional AI interpretation', included: true },
      { text: 'Local AI via Ollama (no cloud needed)', included: true },
      { text: 'Optional cloud LLM (user-controlled)', included: true },
      { text: 'Customer portal: view licenses, download license files, manage billing, open support tickets', included: true },
      { text: 'Manage or cancel your subscription in the billing portal', included: true },
    ],
    cta: 'Start 30-Day Free Trial',
    popular: false,
  },
  {
    name: 'Team',
    description: 'For development teams (5 devices)',
    monthlyPrice: 119,
    annualPrice: 1199,
    annualMonthly: 99.90,
    savings: 811,
    features: [
      { text: '5 licenses, each activated on one device', included: true, bold: true },
      { text: 'No limit on the number of SQL Servers you connect to', included: true, bold: true },
      { text: 'All core modules', included: true },
      { text: 'Evidence reports with optional AI interpretation', included: true },
      { text: 'Local AI via Ollama (no cloud needed)', included: true },
      { text: 'Optional cloud LLM (user-controlled)', included: true },
      { text: 'Customer portal: view licenses, download license files, manage billing, open support tickets', included: true },
      { text: 'Manage or cancel your subscription in the billing portal', included: true },
    ],
    cta: 'Start 30-Day Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large teams (20+ devices)',
    customPricing: true,
    features: [
      { text: '20+ licenses, each activated on one device', included: true, bold: true },
      { text: 'Everything in Team', included: true },
      { text: 'Available on request: security review questionnaire, onboarding session, support SLA, invoice billing', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true)

  return (
    <section
      id="pricing"
      className="relative scroll-mt-24 bg-gray-50 px-6 pt-12 pb-16 lg:px-10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span 
            className={`text-sm font-medium cursor-pointer transition-colors ${!isAnnual ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}
            onClick={() => setIsAnnual(false)}
          >
            Monthly
          </span>
          
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={isAnnual}
              onChange={(e) => setIsAnnual(e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
          
          <span 
            className={`text-sm font-medium cursor-pointer transition-colors ${isAnnual ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}
            onClick={() => setIsAnnual(true)}
          >
            Annual
          </span>
          
          {/* Annual saves 14.1% on Developer ($402 vs $468) and 16.0% on Team ($1,199 vs
              $1,428). The badge said 20% until 2026-10-04, which neither plan reaches. */}
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/70">
            Save up to 16%
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative flex flex-col rounded-2xl bg-white p-6 lg:p-8 transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                plan.popular
                  ? 'border border-primary shadow-md shadow-primary/10 ring-1 ring-primary/20'
                  : 'border border-gray-200/80 shadow-sm'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-5 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm ring-2 ring-white">
                  Best Value
                </span>
              )}

              {/* Plan info */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-500">{plan.description}</p>
                {plan.name === 'Team' && (
                  <p className="text-xs text-primary font-semibold mt-2">
                    Ideal for growing engineering teams.
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="mb-2">
                {plan.customPricing ? (
                  <>
                    <span className="text-4xl font-bold tracking-tight">Custom</span>
                    <span className="text-gray-400 ml-2">volume pricing</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold tracking-tight">
                      ${isAnnual ? plan.annualPrice?.toLocaleString() : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-400 ml-2">/ {isAnnual ? 'year' : 'month'}</span>
                  </>
                )}
              </div>

              {/* Annual note */}
              <div className="text-sm text-gray-400 mb-5 min-h-[20px]">
                {plan.customPricing 
                  ? 'Flexible billing options'
                  : isAnnual 
                    ? (
                      <span>
                        Billed annually
                        <span className="text-xs text-gray-400"> (${plan.annualMonthly}/mo)</span>
                      </span>
                    )
                    : 'Billed monthly'
                }
              </div>

              {/* Savings badge */}
              {plan.savings && isAnnual && (
                <div className="mb-6 rounded-lg bg-emerald-50 px-4 py-2 text-center text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200/70">
                  Save ${plan.savings}/year vs 5 Developer licenses
                </div>
              )}

              {/* Features */}
              <ul className="space-y-2 mb-6 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'} ${feature.bold ? 'font-semibold' : ''}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-auto">
                <Link 
                  href={plan.name === 'Enterprise' ? 'mailto:sales@sqlperformance.ai' : '/download'}
                  className={`block w-full rounded-full px-6 py-3 text-center text-sm font-semibold transition-all ${
                    plan.popular
                      ? 'bg-cta text-white shadow-cta hover:-translate-y-0.5 hover:bg-cta-hover hover:shadow-cta-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-cta/30'
                      : plan.name === 'Developer'
                        ? 'border border-primary/30 bg-white text-primary hover:border-primary/50 hover:bg-primary-light/40'
                        : 'border border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  {plan.cta}
                </Link>

                {plan.name === 'Developer' && (
                  <p className="mt-3 text-xs text-gray-500 text-center">
                    Perfect for individual SQL Server developers.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 text-center p-6 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-600">
            Every plan starts with a <span className="font-semibold text-primary">30-day free trial</span> with full features. No credit card required; the trial needs an email address and runs once per machine.
          </p>
        </div>
      </div>
    </section>
  )
}
