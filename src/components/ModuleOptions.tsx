'use client';

import { useState, useEffect } from 'react';
import { ModuleOption } from '@/types/item';
import { MODULE_OPTIONS, GRADES, MODULE_VALUES } from '@/constants/items';
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
        value: MODULE_VALUES['criticalDamage']['grey']
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
        const type = e.target.value as ModuleOption['type'];
        setNewOption(prev => ({
            ...prev,
            type,
            value: MODULE_VALUES[type][prev.grade]
        }));
    };

    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const grade = e.target.value as ModuleOption['grade'];
        setNewOption(prev => ({
            ...prev,
            grade,
            value: MODULE_VALUES[prev.type][grade]
        }));
    };

    const resetNewOption = () => {
        const defaultType = availableOptions[0]?.key || 'criticalDamage';
        const defaultGrade = 'grey';
        setNewOption({
            type: defaultType,
            grade: defaultGrade,
            value: MODULE_VALUES[defaultType][defaultGrade]
        });
    };

    const addOption = () => {
        if (options.length >= 4) return;
        setIsAdding(true);
    };

    const confirmOption = () => {
        onChange([...options, newOption]);
        setIsAdding(false);
        resetNewOption();
    };

    const cancelOption = () => {
        setIsAdding(false);
        resetNewOption();
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
                        <span className={styles.optionValue}>
                            +{MODULE_VALUES[option.type][option.grade]}%
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
                        onChange={handleGradeChange}
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