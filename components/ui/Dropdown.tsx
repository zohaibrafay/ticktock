"use client";

import React, { memo } from "react";

export interface DropdownProps<T> {
    options: T[];
    value?: T | null;
    onChange: (value: T) => void;
    getLabel: (option: T) => string;
    getValue: (option: T) => string | number;
    placeholder?: string;
    className?: string;
}

function DropdownComponent<T>({
    options,
    value,
    onChange,
    getLabel,
    getValue,
    placeholder = "Select...",
    className = "",
}: DropdownProps<T>) {

    return (
        <div className="rounded-lg border border-input bg-card px-2 text-sm text-foreground outline-none transition-all ">
            <select
                className={`px-1 py-2 focus:outline-none ${className}`}
                value={value ? getValue(value) : ""}
                onChange={(e) => {
                    const selected = options.find(
                        (opt) => String(getValue(opt)) === e.target.value
                    );

                    if (selected) {
                        onChange(selected);
                    } else if (e.target.value === "") {
                        // Allow clearing selection by clicking placeholder
                        // Pass a dummy option with empty value
                        const clearOption = { label: placeholder || "Select...", value: "" } as unknown as T;
                        onChange(clearOption);
                    }
                }}
            >
                <option value="">{placeholder}</option>

                {options.map((option) => (
                    <option key={getValue(option)} value={getValue(option)}>
                        {getLabel(option)}
                    </option>
                ))}
            </select>
        </div>
    );
}

export const Dropdown = memo(DropdownComponent) as <T>(props: DropdownProps<T>) => React.ReactElement;