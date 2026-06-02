'use client';

import { useParams } from 'next/navigation';

export interface SubjectTheme {
  text: string;
  textHover: string;
  bg: string;
  bgHover: string;
  bgLight50: string;
  bgLight10: string;
  bgLight15: string;
  bgLight20: string;
  ring: string;
  border: string;
  borderLight: string;
  tactileBtn: string;
}

export const SUBJECT_THEMES: Record<string, SubjectTheme> = {
  'am-nhac': {
    text: 'text-purple-600',
    textHover: 'hover:text-purple-750',
    bg: 'bg-purple-500',
    bgHover: 'hover:bg-purple-600',
    bgLight50: 'bg-purple-50',
    bgLight10: 'bg-purple-500/10',
    bgLight15: 'bg-purple-500/15',
    bgLight20: 'bg-purple-500/20',
    ring: 'ring-purple-200',
    border: 'border-purple-500',
    borderLight: 'border-purple-250',
    tactileBtn: 'tactile-btn-purple'
  },
  'luyen-go-10-ngon': {
    text: 'text-cyan-600',
    textHover: 'hover:text-cyan-750',
    bg: 'bg-cyan-500',
    bgHover: 'hover:bg-cyan-600',
    bgLight50: 'bg-cyan-50',
    bgLight10: 'bg-cyan-500/10',
    bgLight15: 'bg-cyan-500/15',
    bgLight20: 'bg-cyan-500/20',
    ring: 'ring-cyan-200',
    border: 'border-cyan-500',
    borderLight: 'border-cyan-250',
    tactileBtn: 'tactile-btn-cyan'
  },
  'toan': {
    text: 'text-blue-600',
    textHover: 'hover:text-blue-750',
    bg: 'bg-blue-500',
    bgHover: 'hover:bg-blue-600',
    bgLight50: 'bg-blue-50',
    bgLight10: 'bg-blue-500/10',
    bgLight15: 'bg-blue-500/15',
    bgLight20: 'bg-blue-500/20',
    ring: 'ring-blue-200',
    border: 'border-blue-500',
    borderLight: 'border-blue-250',
    tactileBtn: 'tactile-btn-blue'
  },
  'tieng-viet': {
    text: 'text-green-600',
    textHover: 'hover:text-green-750',
    bg: 'bg-green-500',
    bgHover: 'hover:bg-green-600',
    bgLight50: 'bg-green-50',
    bgLight10: 'bg-green-500/10',
    bgLight15: 'bg-green-500/15',
    bgLight20: 'bg-green-500/20',
    ring: 'ring-green-200',
    border: 'border-green-500',
    borderLight: 'border-green-250',
    tactileBtn: 'tactile-btn-green'
  },
  'dao-duc': {
    text: 'text-red-600',
    textHover: 'hover:text-red-750',
    bg: 'bg-red-500',
    bgHover: 'hover:bg-red-600',
    bgLight50: 'bg-red-50',
    bgLight10: 'bg-red-500/10',
    bgLight15: 'bg-red-500/15',
    bgLight20: 'bg-red-500/20',
    ring: 'ring-red-200',
    border: 'border-red-500',
    borderLight: 'border-red-250',
    tactileBtn: 'tactile-btn-red'
  },
  'hoat-dong-trai-nghiem': {
    text: 'text-orange-600',
    textHover: 'hover:text-orange-750',
    bg: 'bg-orange-500',
    bgHover: 'hover:bg-orange-600',
    bgLight50: 'bg-orange-50',
    bgLight10: 'bg-orange-500/10',
    bgLight15: 'bg-orange-500/15',
    bgLight20: 'bg-orange-500/20',
    ring: 'ring-orange-200',
    border: 'border-orange-500',
    borderLight: 'border-orange-250',
    tactileBtn: 'tactile-btn-orange'
  }
};

export function useSubjectTheme() {
  const params = useParams();
  const subjectId = (params?.subjectId as string) || 'toan';
  return SUBJECT_THEMES[subjectId] || SUBJECT_THEMES['toan'];
}
