'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';

export function KanbanExample() {
  const t = useTranslations('examples.kanban');
  const columns = [
    {
      key: 'todo',
      title: t('columns.todo'),
      tasks: [
        { title: t('tasks.avatarMenu'), owner: 'Kiko' },
        { title: t('tasks.apiDocs'), owner: 'Ember' },
      ],
    },
    {
      key: 'inProgress',
      title: t('columns.inProgress'),
      tasks: [
        { title: t('tasks.preview'), owner: 'Nova' },
        { title: t('tasks.profileLayout'), owner: 'Milo' },
      ],
    },
  ] as const;

  return (
    <section className='min-w-0' aria-labelledby='examples-kanban-title'>
      <h2
        id='examples-kanban-title'
        className='[font-family:var(--font-serif),Georgia,serif] text-[1.5rem] leading-[1.15] font-normal tracking-[-0.02em] text-heading'
      >
        {t('title')}
      </h2>
      <p className='mt-2 text-sm leading-relaxed text-foreground-secondary'>{t('description')}</p>

      <div className='mt-4 rounded-3xl border border-border bg-surface-raised p-4 sm:p-5'>
        <div className='flex items-center justify-between gap-3 border-b border-divider pb-3'>
          <div className='min-w-0'>
            <p className='text-xs font-medium text-heading'>{t('board')}</p>
            <p className='mt-0.5 truncate text-xs text-foreground-tertiary'>{t('project')}</p>
          </div>
          <span className='shrink-0 text-xs text-foreground-tertiary'>{t('taskCount', { count: 4 })}</span>
        </div>

        <div className='mt-3 grid grid-cols-2 gap-2 sm:gap-3'>
          {columns.map((column) => (
            <div key={column.key} className='min-w-0 rounded-2xl bg-background p-2.5 sm:p-3'>
              <div className='mb-2 flex min-w-0 items-center gap-1.5'>
                <span
                  aria-hidden='true'
                  className={`size-1.5 shrink-0 rounded-full ${
                    column.key === 'inProgress' ? 'bg-accent' : 'bg-foreground-quaternary'
                  }`}
                />
                <h3 className='min-w-0 truncate text-xs font-medium text-heading-secondary'>
                  {column.title}
                </h3>
                <span className='ml-auto text-[0.6875rem] text-foreground-tertiary'>
                  {column.tasks.length}
                </span>
              </div>
              <ul className='flex min-w-0 flex-col gap-2'>
                {column.tasks.map((task) => (
                  <li
                    key={task.title}
                    className='min-w-0 rounded-xl border border-border bg-surface-raised p-2.5'
                  >
                    <p className='text-xs leading-snug font-medium text-heading'>{task.title}</p>
                    <div className='mt-3 flex min-w-0 items-center gap-1.5'>
                      <span aria-hidden='true' className='shrink-0'>
                        <Mimo
                          name={task.owner}
                          size={26}
                          shape='circle'
                          detailLevel='basic'
                          mood={task.owner === 'Nova' ? 'happy' : undefined}
                        />
                      </span>
                      <span className='truncate text-[0.6875rem] text-foreground-tertiary'>{task.owner}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
