import type { Material } from '@/types'

export const mockMaterials: Material[] = [
  {
    id: 'mat-1',
    title: 'Формулы тригонометрии',
    description: 'Основные тригонометрические тождества и формулы приведения',
    teacherId: 'teacher-1',
    fileName: 'trigonometry_formulas.pdf',
    fileType: 'pdf',
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'mat-2',
    title: 'Теория вероятностей — конспект',
    description: 'Базовые понятия теории вероятностей для подготовки к ЕГЭ',
    teacherId: 'teacher-1',
    fileName: 'probability_theory.pdf',
    fileType: 'pdf',
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'mat-3',
    title: 'Задачи на проценты',
    description: 'Сборник задач на проценты разной сложности',
    teacherId: 'teacher-1',
    fileName: 'percent_problems.docx',
    fileType: 'docx',
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'mat-4',
    title: 'Геометрия — планиметрия',
    description: 'Основные теоремы и формулы планиметрии',
    teacherId: 'teacher-1',
    fileName: 'planimetry.pdf',
    fileType: 'pdf',
    createdAt: '2026-03-01T10:00:00Z',
  },
]
