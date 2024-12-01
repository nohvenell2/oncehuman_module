'use client';

import { Equipment, Grade } from '@/types/item';
import { MODULE_OPTIONS } from '@/constants/items';
import styles from './StatSummary.module.scss';

/**
 * 등급별 가중치 점수
 */
const GRADE_SCORES: Record<Grade, number> = {
    grey: 1,
    green: 2,
    blue: 3,
    purple: 4,
    yellow: 5
};

interface StatSummaryProps {
    equipment: Equipment;
}

export default function StatSummary({ equipment }: StatSummaryProps) {
    const stats = Object.entries(MODULE_OPTIONS).reduce((acc, [type]) => {
        acc[type] = {
            value: 0,
            score: 0
        };
        return acc;
    }, {} as Record<string, { value: number; score: number }>);

    Object.values(equipment).forEach(item => {
        if (!item?.moduleOptions) return;
        
        item.moduleOptions.forEach(option => {
            if (option.type in MODULE_OPTIONS) {
                stats[option.type].value += option.value;
                stats[option.type].score += GRADE_SCORES[option.grade];
            }
        });
    });
    
    const nonZeroStats = Object.entries(stats)
        .filter(([_, { value }]) => value > 0)
        .sort((a, b) => {
            // 먼저 점수로 정렬
            const scoreDiff = b[1].score - a[1].score;
            // 점수가 같으면 value로 정렬
            return scoreDiff !== 0 ? scoreDiff : b[1].value - a[1].value;
        });

    if (nonZeroStats.length === 0) return null;

    return (
        <div className={styles.statSummary}>
            <h2 className={styles.title}>총 옵션 합계</h2>
            <div className={styles.statList}>
                {nonZeroStats.map(([type, { value }]) => (
                    <div key={type} className={styles.statItem}>
                        <span className={styles.statName}>{MODULE_OPTIONS[type as keyof typeof MODULE_OPTIONS]}</span>
                        <span className={styles.statValue}>+{value.toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
} 