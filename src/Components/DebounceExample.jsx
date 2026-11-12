import React, { useState, useEffect } from 'react';

function DebounceExample() {
    const [value, setValue] = useState('');
    const [debouncedVal, setDebouncedVal] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedVal(value);
        }, 1000)
        return () => clearTimeout(timer);
    }, [value])

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <div className="live-example">
            <h3>Live Debounce Example</h3>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Type to search..."
                className="debounce-input"
            />
            {(value || debouncedVal) && (
                <>
                    <p>Typed Value: {value}</p>
                    <p>Debounced API Value: {debouncedVal}</p>
                </>
            )}

        </div>
    );
}

export default DebounceExample;
