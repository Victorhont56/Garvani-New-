import { useState } from "react";


interface StateLGADropdownsProps {
  statesWithLGAs: Record<string, string[]>; // Type for the states and LGAs data
}

export function StateLGADropdowns({ statesWithLGAs }: StateLGADropdownsProps) {
  const [selectedState, setSelectedState] = useState("");
  const [lgas, setLgas] = useState<string[]>([]);

  // Handle state selection
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    setSelectedState(state);
    setLgas(statesWithLGAs[state] || []);
  };

  return (
    <>
      {/* State Dropdown */}
      <div className="flex flex-col gap-y-2">
        <div>State</div>
        <select
          name="state"
          required
          value={selectedState}
          onChange={handleStateChange}
          className="p-2 border rounded"
        >
          <option value="">Select a state</option>
          {Object.keys(statesWithLGAs).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* LGA Dropdown */}
      <div className="flex flex-col gap-y-2">
        <div>Local Government Area (LGA)</div>
        <select
          name="lga"
          required
          disabled={!selectedState}
          className="p-2 border rounded"
        >
          <option value="">Select an LGA</option>
          {lgas.map((lga) => (
            <option key={lga} value={lga}>
              {lga}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}