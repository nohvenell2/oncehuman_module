'use client';

import { useState, useEffect } from 'react';
import { ModuleOption } from '@/types/item';
import moduleNames from '@/data/moduleNames.json';
import styles from './ModuleOptions.module.scss';
import { GRADES, MODULE_OPTIONS, MODULE_VALUES } from '@/constants/items';

interface ModuleOptionsProps {
    options: ModuleOption[];
    moduleName?: string;
    onChange: (options: ModuleOption[]) => void;
    onModuleNameChange: (name: string) => void;
    type: '무기' | '헬멧' | '마스크' | '상의' | '장갑' | '하의' | '신발';
}

export default function ModuleOptions({ 
    options = [], 
    moduleName = '', 
    onChange,
    onModuleNameChange,
    type 
}: ModuleOptionsProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [searchTerm, setSearchTerm] = useState(moduleName);
    const [isComboboxOpen, setIsComboboxOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newOption, setNewOption] = useState<ModuleOption>({
        type: 'criticalDamage',
        grade: 'grey',
        value: MODULE_VALUES.criticalDamage.grey
    });
    const [blurTimeoutId, setBlurTimeoutId] = useState<NodeJS.Timeout | null>(null);
    // 해당 type의 모듈 목록 가져오기
    const availableModules = moduleNames[type] || [];
    const filteredModules = availableModules.filter(module => 
        module.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleModuleSelect = (selectedModule: typeof availableModules[0]) => {
        onModuleNameChange(selectedModule.name);
        setIsComboboxOpen(false);
        setSearchTerm(selectedModule.name);
        setIsEditingName(false);
    };

    const addOption = () => setIsAdding(true);
    const cancelOption = () => setIsAdding(false);
    const removeOption = (index: number) => {
        onChange(options.filter((_, i) => i !== index));
    };

    const confirmOption = () => {
        onChange([...options, newOption]);
        setIsAdding(false);
        setNewOption({
            type: 'criticalDamage',
            grade: 'grey',
            value: MODULE_VALUES.criticalDamage.grey
        });
    };

    const handleOptionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value as keyof typeof MODULE_OPTIONS;
        setNewOption({
            ...newOption,
            type,
            value: MODULE_VALUES[type][newOption.grade]
        });
    };

    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const grade = e.target.value as keyof typeof GRADES;
        setNewOption({
            ...newOption,
            grade,
            value: MODULE_VALUES[newOption.type][grade]
        });
    };

    const availableOptions = Object.entries(MODULE_OPTIONS).map(([key, value]) => ({
        key,
        value
    }));

    useEffect(() => {
        return () => {
            if (blurTimeoutId) {
                clearTimeout(blurTimeoutId);
            }
        };
    }, [blurTimeoutId]);

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
                    <div className={styles.comboboxContainer}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setIsComboboxOpen(true);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && filteredModules.length > 0) {
                                    handleModuleSelect(filteredModules[0]);
                                } else if (e.key === 'Escape') {
                                    setIsComboboxOpen(false);
                                }
                            }}
                            onFocus={() => setIsComboboxOpen(true)}
                            onBlur={() => {
                                const timeoutId = setTimeout(() => setIsComboboxOpen(false), 200);
                                setBlurTimeoutId(timeoutId);
                            }}
                            placeholder="모듈 이름 검색..."
                            className={styles.comboboxInput}
                            autoFocus={isEditingName}
                        />
                        {isComboboxOpen && filteredModules.length > 0 && (
                            <ul className={styles.comboboxDropdown}>
                                {filteredModules.map((module) => (
                                    <li
                                        key={module.name}
                                        onClick={() => handleModuleSelect(module)}
                                        className={styles.comboboxItem}
                                    >
                                        <div className={styles.moduleItem}>
                                            <span className={styles.moduleName}>{module.name}</span>
                                            <span className={styles.moduleFeatures}>{`[${module.features}]`}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.moduleOptionsList}>
                {options.map((option, index) => (
                    <div key={`${option.type}-${option.grade}-${index}`} 
                         className={`${styles.moduleOptionItem} ${styles[option.grade]}`}>
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