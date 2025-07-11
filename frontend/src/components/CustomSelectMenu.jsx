import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { MdUnfoldMore, MdCheck } from 'react-icons/md';
import './CustomSelectMenu.css';

// This component is updated to work with ObjectIDs and return the full object on change.
function CustomSelectMenu({ label, options, selected, onChange, placeholder = "Select an option...", disabled = false }) {
  // Find the full object for the selected value using its _id
  const selectedOption = options.find(option => option._id === selected);

  return (
    <div className="custom-select-wrapper">
      <Listbox value={selected} onChange={onChange} disabled={disabled}>
        {label && <Listbox.Label className="custom-select-label">{label}</Listbox.Label>}
        <div className="custom-select-container">
          <Listbox.Button className={`custom-select-button ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <span className="block truncate">
              {selectedOption ? selectedOption.name : placeholder}
            </span>
            <span className="custom-select-icon">
              <MdUnfoldMore aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="custom-select-options">
              {options.map((option) => (
                <Listbox.Option
                  key={option._id}
                  className={({ active }) => `custom-select-option ${active ? 'active' : ''}`}
                  value={option} // Pass the entire object back on change
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {option.name}
                      </span>
                      {selected ? (
                        <span className="custom-select-check-icon">
                          <MdCheck aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

export default CustomSelectMenu;