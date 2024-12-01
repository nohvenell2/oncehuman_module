'use client';

import { useState, useEffect } from 'react';
import { ModuleOption } from '@/types/item';
import { MODULE_OPTIONS, GRADES } from '@/constants/items';
import styles from './ModuleOptions.module.scss';

interface ModuleOptionsProps {
    options: ModuleOption[];
    moduleName?: string;
    onChange: (options: ModuleOption[]) => void;
    onModuleNameChange: (name: string) => void;
}

export default function ModuleOptions({ 
    options = [], 
    moduleName = '', 
    onChange,
    onModuleNameChange 
}: ModuleOptionsProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempModuleName, setTempModuleName] = useState(moduleName);
    const [newOption, setNewOption] = useState<ModuleOption>(() => ({
        type: 'criticalDamage',
        grade: 'grey',
        value: 0
    }));

    const availableOptions = Object.entries(MODULE_OPTIONS)
        .filter(([key]) => !options.some(option => option.type === key))
        .map(([key, value]) => ({
            key: key as ModuleOption['type'],
            value
        }));

    useEffect(() => {
        if (availableOptions.length > 0) {
            setNewOption(prev => ({
                ...prev,
                type: availableOptions[0].key
            }));
        }
    }, [availableOptions.length]);

    const handleOptionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewOption(prev => ({
            ...prev,
            type: e.target.value as ModuleOption['type']
        }));
    };

    const addOption = () => {
        if (options.length >= 4) return;
        setIsAdding(true);
    };

    const confirmOption = () => {
        onChange([...options, newOption]);
        setIsAdding(false);
        setNewOption({ type: availableOptions[0]?.key || 'criticalDamage', grade: 'grey', value: 0 });
    };

    const cancelOption = () => {
        setIsAdding(false);
        setNewOption({ type: availableOptions[0]?.key || 'criticalDamage', grade: 'grey', value: 0 });
    };

    const removeOption = (index: number) => {
        onChange(options.filter((_, i) => i !== index));
    };

    const handleModuleNameSubmit = () => {
        onModuleNameChange(tempModuleName);
        setIsEditingName(false);
    };

    return (
        <div className={styles.moduleOptions}>
            <div className={styles.moduleNameSection}>
                {!isEditingName && moduleName ? (
                    <div className={styles.moduleNameDisplay}>
                        <span>{moduleName}</span>
                        <button 
                            onClick={() => setIsEditingName(true)}
                            className={styles.editButton}
                            aria-label="모듈 이름 수정"
                        >
                            ✎
                        </button>
                    </div>
                ) : (
                    <input
                        type="text"
                        value={tempModuleName}
                        onChange={(e) => setTempModuleName(e.target.value)}
                        onBlur={handleModuleNameSubmit}
                        onKeyPress={(e) => e.key === 'Enter' && handleModuleNameSubmit()}
                        placeholder="모듈 이름"
                        className={styles.input}
                        autoFocus={isEditingName}
                    />
                )}
            </div>
            <div className={styles.optionsList}>
                {options.map((option, index) => (
                    <div key={`${option.type}-${option.grade}-${index}`} 
                         className={`${styles.optionItem} ${styles[option.grade]}`}>
                        <span className={`${styles.gradeIcon} ${styles[option.grade]}`}>
                            ◆
                        </span>
                        <span className={styles.optionText}>
                            {MODULE_OPTIONS[option.type]}
                        </span>
                        <button
                            onClick={() => removeOption(index)}
                            className={styles.removeButton}
                            aria-label="옵션 삭제"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
            
            {isAdding ? (
                <div className={`${styles.newOptionForm} ${styles[newOption.grade]}`}>
                    <span className={`${styles.gradeIcon} ${styles[newOption.grade]}`}>
                        ◆
                    </span>
                    <select
                        value={newOption.type}
                        onChange={handleOptionTypeChange}
                        className={styles.select}
                        data-type="option"
                    >
                        {availableOptions.map(({ key, value }) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}
                    </select>
                    <select
                        value={newOption.grade}
                        onChange={(e) => setNewOption(prev => ({
                            ...prev,
                            grade: e.target.value as ModuleOption['grade']
                        }))}
                        className={`${styles.select} ${styles[newOption.grade]}`}
                        data-type="grade"
                    >
                        {Object.entries(GRADES).map(([value, label]) => (
                            <option key={value} value={value} className={styles[value]}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <div className={styles.buttonGroup}>
                        <button 
                            onClick={confirmOption} 
                            className={styles.confirmButton}
                            aria-label="옵션 입력 확인"
                        >
                            O
                        </button>
                        <button 
                            onClick={cancelOption} 
                            className={styles.cancelButton}
                            aria-label="옵션 입력 취소"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ) : (
                options.length < 4 && availableOptions.length > 0 && (
                    <button onClick={addOption} className={styles.addButton}>
                        +
                    </button>
                )
            )}
        </div>
    );
} 