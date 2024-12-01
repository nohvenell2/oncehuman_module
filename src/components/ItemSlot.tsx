'use client';

import { useState } from 'react';
import { Item, ModuleOption } from '@/types/item';
import styles from './ItemSlot.module.scss';
import ModuleOptions from './ModuleOptions';

interface ItemSlotProps {
    label: string;
    item: Item;
    onChange: (item: Item) => void;
}

export default function ItemSlot({ label, item, onChange }: ItemSlotProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(item.name);

    const handleChange = (field: keyof Item, value: string | ModuleOption[]) => {
        onChange({
            ...item,
            [field]: value
        });
    };

    const handleNameSubmit = () => {
        handleChange('name', tempName);
        setIsEditing(false);
    };

    return (
        <div className={styles.itemSlot}>
            <div className={styles.header}>
                <h3>{label}</h3>
                {!isEditing && item.name ? (
                    <div className={styles.nameDisplay}>
                        <span>{item.name}</span>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className={styles.editButton}
                            aria-label="이름 수정"
                        >
                            ✎
                        </button>
                    </div>
                ) : (
                    <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onBlur={handleNameSubmit}
                        onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                        placeholder="아이템 이름"
                        className={styles.input}
                        autoFocus={isEditing}
                    />
                )}
            </div>
            <ModuleOptions
                options={item.moduleOptions}
                moduleName={item.moduleName}
                onChange={(newOptions) => handleChange('moduleOptions', newOptions)}
                onModuleNameChange={(newName) => handleChange('moduleName', newName)}
            />
        </div>
    );
} 