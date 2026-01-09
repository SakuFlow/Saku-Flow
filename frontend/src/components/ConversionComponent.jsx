import React, { useState, useMemo, useEffect } from 'react'

const ConversionComponent = ({ maxEnergy }) => {
  const MIN = 50
  const MAX_STEPS = 7
  const CONVERSION_RATE = 1.3

  const { step, values } = useMemo(() => {
    if (maxEnergy <= MIN) {
      return {
        step: 1,
        values: [MIN],
      }
    }

    const range = maxEnergy - MIN
    const steps = Math.min(MAX_STEPS, range + 1)
    const step = Math.max(1, Math.floor(range / (steps - 1)))

    const values = Array.from({ length: steps }, (_, i) =>
      MIN + i * step
    )

    values[values.length - 1] = maxEnergy

    return { step, values }
  }, [maxEnergy])

  const [energyToConvert, setEnergyToConvert] = useState(MIN)

  useEffect(() => {
    setEnergyToConvert(values[0])
  }, [values])

  const sunsGained = Math.round(energyToConvert * CONVERSION_RATE)

  const disabled = maxEnergy <= MIN

  return (
    <div className="flex justify-center items-center w-full mt-10">
      <div className="bg-base-200 rounded-2xl shadow-xl p-6 w-full max-w-md text-center space-y-6">

        <h2 className="text-2xl font-bold text-primary">
          Energy Conversion
        </h2>

        <p className="text-sm text-base-content/70">
          Convert your energy to get more suns
        </p>

        {/* Slider */}
        <div className="space-y-4">
          <input
            type="range"
            min={MIN}
            max={maxEnergy}
            step={step}
            value={energyToConvert}
            disabled={disabled}
            onChange={(e) => setEnergyToConvert(Number(e.target.value))}
            className="range range-primary"
          />

          {/* Tick marks */}
          <div className="flex justify-between px-2 text-xs opacity-60">
            {values.map((_, i) => (
              <span key={i}>|</span>
            ))}
          </div>

          {/* Labels */}
          <div className="flex justify-between px-2 text-xs">
            {values.map((v) => (
              <span key={v}>{v}</span>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="bg-base-100 rounded-xl p-4 shadow-inner space-y-2">
          <div className="flex justify-between text-sm">
            <span>Energy Used</span>
            <span className="font-semibold">{energyToConvert}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Suns Gained</span>
            <span className="font-semibold text-warning">
              +{sunsGained}
            </span>
          </div>
        </div>

        {/* Action */}
        <button
          className="btn btn-primary w-full"
          disabled={disabled}
        >
          Convert Energy
        </button>

        {disabled && (
          <p className="text-xs text-error">
            You need more than {MIN} energy to convert.
          </p>
        )}
      </div>
    </div>
  )
}

export default ConversionComponent
