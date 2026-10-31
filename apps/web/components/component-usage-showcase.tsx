'use client';

import { Mimo } from 'mimo-id/react';
import { useTranslations } from 'next-intl';
import { ComponentExampleCard } from './component-example-card';

type ChatMessage = {
  id: string;
  author: string;
  text: string;
  mine: boolean;
};

type TeamMember = {
  name: string;
  role: string;
};

type LeaderboardPlayer = {
  name: string;
  score: number;
};

type Comment = {
  id: string;
  author: string;
  time: string;
  text: string;
};

const stackMembers = ['Camille', 'Liam', 'Ndifor', 'Sophia', 'Essomba', 'Maxime', 'Hugo'];

function chatSnippet(messages: ChatMessage[], typingLabel: string) {
  return `import { Mimo } from 'mimo-id/react';

const messages = ${JSON.stringify(messages, null, 2)};
const typingLabel = ${JSON.stringify(typingLabel)};

export function GroupChat() {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={
            message.mine
              ? 'flex min-w-0 justify-end'
              : 'flex min-w-0 items-end gap-2'
          }
        >
          {!message.mine && (
            <Mimo
              aria-hidden="true"
              name={message.author}
              size={40}
              shape="circle"
            />
          )}
          <div
            className={
              message.mine
                ? 'min-w-0 max-w-[84%] rounded-2xl bg-accent px-4 py-3 text-background'
                : 'min-w-0 max-w-[84%] rounded-2xl bg-surface-raised px-4 py-3 text-foreground'
            }
          >
            {!message.mine && (
              <p className="mb-1 text-xs font-semibold">{message.author}</p>
            )}
            <p className="wrap-break-word text-sm leading-relaxed">{message.text}</p>
          </div>
          {message.mine && (
            <Mimo
              aria-hidden="true"
              name={message.author}
              size={40}
              shape="circle"
            />
          )}
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Mimo
          aria-hidden="true"
          name="Hugo"
          size={28}
          shape="circle"
          detailLevel="basic"
        />
        <span className="text-sm text-foreground-secondary">{typingLabel}</span>
      </div>
    </div>
  );
}`;
}

function teamSnippet(members: TeamMember[]) {
  return `import { Mimo } from 'mimo-id/react';

const members = ${JSON.stringify(members, null, 2)};

export function TeamDirectory() {
  return (
    <section className="rounded-3xl border border-border bg-surface-raised p-6">
      <div className="flex flex-col items-center text-center">
        <Mimo
          aria-hidden="true"
          name="Kevin Kenfack"
          size={88}
          shape="squircle"
          detailLevel="standard"
        />
        <h2 className="mt-3 text-xl font-semibold">Kevin Kenfack</h2>
        <p className="text-sm text-foreground-secondary">Founder &amp; Lead Dev</p>
      </div>
      <div className="my-6 border-t border-divider" />
      <ul className="grid grid-cols-3 gap-4">
        {members.map((member) => (
          <li key={member.name} className="flex min-w-0 flex-col items-center text-center">
            <Mimo
              aria-hidden="true"
              name={member.name}
              size={52}
              shape="squircle"
            />
            <span className="mt-2 max-w-full truncate text-sm font-semibold">{member.name}</span>
            <span className="max-w-full truncate text-xs text-foreground-secondary">{member.role}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}`;
}

function leaderboardSnippet(players: LeaderboardPlayer[], pointsLabel: string) {
  return `import { Mimo } from 'mimo-id/react';

const players = ${JSON.stringify(players, null, 2)};
const pointsLabel = ${JSON.stringify(pointsLabel)};

export function Leaderboard() {
  return (
    <ol className="flex flex-col gap-2">
      {players.map((player, index) => (
        <li
          key={player.name}
          className={
            index === 0
              ? 'grid min-w-0 grid-cols-[1.25rem_2.5rem_minmax(0,1fr)_auto] items-center gap-2 rounded-2xl bg-accent/10 p-2'
              : 'grid min-w-0 grid-cols-[1.25rem_2.5rem_minmax(0,1fr)_auto] items-center gap-2 rounded-2xl p-2'
          }
        >
          <span className="text-sm font-semibold">{index + 1}</span>
          <Mimo
            aria-hidden="true"
            name={player.name}
            size={40}
            shape="squircle"
          />
          <strong className="min-w-0 truncate">{player.name}</strong>
          <span className="whitespace-nowrap text-right text-xs tabular-nums">
            {player.score.toLocaleString()} {pointsLabel}
          </span>
        </li>
      ))}
    </ol>
  );
}`;
}

function commentsSnippet(comments: Comment[], likeLabel: string) {
  return `import { Mimo } from 'mimo-id/react';

const comments = ${JSON.stringify(comments, null, 2)};
const likeLabel = ${JSON.stringify(likeLabel)};

export function CommentList() {
  return (
    <ul className="divide-y divide-divider">
      {comments.map((comment) => (
        <li key={comment.id} className="flex min-w-0 gap-3 py-4">
          <Mimo
            aria-hidden="true"
            name={comment.author}
            size={44}
            shape="circle"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <strong>{comment.author}</strong>
              <span className="text-sm text-foreground-tertiary">{comment.time}</span>
            </div>
            <p className="mt-1 wrap-break-word text-sm leading-relaxed">{comment.text}</p>
            <span className="mt-2 inline-flex text-xs text-foreground-secondary">
              {likeLabel}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}`;
}

function avatarStackSnippet(members: string[]) {
  return `import { Mimo } from 'mimo-id/react';

const members = ${JSON.stringify(members, null, 2)};

export function AvatarGroup() {
  const visibleMembers = members.slice(0, 3);

  return (
    <div className="flex items-center">
      {visibleMembers.map((name, index) => (
        <span
          key={name}
          className={
            index === 0
              ? 'relative rounded-full border-2 border-background bg-surface-raised p-0.5'
              : 'relative -ml-3 rounded-full border-2 border-background bg-surface-raised p-0.5'
          }
        >
          <Mimo
            aria-hidden="true"
            name={name}
            size={42}
            shape="circle"
          />
        </span>
      ))}
      <span className="-ml-2 inline-flex size-11 items-center justify-center rounded-full border-2 border-background bg-surface text-xs font-semibold">
        +{members.length - visibleMembers.length}
      </span>
    </div>
  );
}`;
}

function ChatPreview({
  messages,
  channel,
  heading,
  typingLabel,
}: {
  messages: ChatMessage[];
  channel: string;
  heading: string;
  typingLabel: string;
}) {
  return (
    <div className='min-w-0'>
      <div className='mb-4 flex flex-wrap items-baseline justify-between gap-2'>
        <h4 className='text-base font-semibold tracking-[-0.02em] text-heading'>{heading}</h4>
        <span className='font-mono text-xs text-foreground-tertiary'>{channel}</span>
      </div>
      <div className='flex min-w-0 flex-col gap-3'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex min-w-0 items-end gap-2 ${message.mine ? 'justify-end' : ''}`}
          >
            {!message.mine && (
              <Mimo
                aria-hidden={true}
                name={message.author}
                size={38}
                shape='circle'
                detailLevel='full'
                depth='none'
                interactive={false}
                className='shrink-0'
              />
            )}
            <div
              className={`min-w-0 max-w-[84%] rounded-2xl px-3 py-2.5 sm:px-4 ${
                message.mine ? 'bg-accent text-background' : 'bg-surface text-heading'
              }`}
            >
              {!message.mine && (
                <p className='mb-1 text-xs font-semibold text-foreground-secondary'>{message.author}</p>
              )}
              <p className='wrap-break-word text-sm leading-relaxed sm:text-base'>{message.text}</p>
            </div>
            {message.mine && (
              <Mimo
                aria-hidden={true}
                name={message.author}
                size={38}
                shape='circle'
                detailLevel='full'
                depth='none'
                interactive={false}
                className='shrink-0'
              />
            )}
          </div>
        ))}
        <div className='flex min-w-0 items-center gap-2 pl-1 text-xs text-foreground-tertiary sm:text-sm'>
          <Mimo
            aria-hidden={true}
            name='Hugo'
            size={28}
            shape='circle'
            detailLevel='basic'
            depth='none'
            interactive={false}
            className='shrink-0'
          />
          <span className='min-w-0 wrap-break-word'>{typingLabel}</span>
        </div>
      </div>
    </div>
  );
}

function TeamPreview({
  heading,
  channel,
  leadRole,
  members,
}: {
  heading: string;
  channel: string;
  leadRole: string;
  members: TeamMember[];
}) {
  return (
    <div className='min-w-0'>
      <div className='mb-4 flex flex-wrap items-baseline justify-between gap-2'>
        <h4 className='text-base font-semibold tracking-[-0.02em] text-heading'>{heading}</h4>
        <span className='font-mono text-xs text-foreground-tertiary'>{channel}</span>
      </div>
      <div className='flex flex-col items-center text-center'>
        <Mimo
          aria-hidden={true}
          name='Kevin Kenfack'
          size={84}
          shape='squircle'
          detailLevel='standard'
          depth='none'
          interactive={false}
        />
        <h5 className='mt-3 text-lg font-semibold tracking-[-0.02em] text-heading'>Kevin Kenfack</h5>
        <p className='text-sm text-foreground-secondary'>{leadRole}</p>
      </div>
      <div className='my-5 border-t border-divider' />
      <ul className='grid min-w-0 grid-cols-3 gap-x-2 gap-y-4 sm:gap-x-3'>
        {members.map((member) => (
          <li key={member.name} className='flex min-w-0 flex-col items-center text-center'>
            <Mimo
              aria-hidden={true}
              name={member.name}
              size={48}
              shape='squircle'
              detailLevel='full'
              depth='none'
              interactive={false}
            />
            <span className='mt-2 max-w-full truncate text-xs font-semibold text-heading sm:text-sm'>
              {member.name}
            </span>
            <span className='max-w-full truncate text-[0.6875rem] text-foreground-tertiary'>
              {member.role}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LeaderboardPreview({
  heading,
  season,
  pointsLabel,
  players,
}: {
  heading: string;
  season: string;
  pointsLabel: string;
  players: LeaderboardPlayer[];
}) {
  return (
    <div className='min-w-0'>
      <div className='mb-4 flex flex-wrap items-baseline justify-between gap-2'>
        <h4 className='text-base font-semibold tracking-[-0.02em] text-heading'>{heading}</h4>
        <span className='font-mono text-xs text-foreground-tertiary'>{season}</span>
      </div>
      <ol className='flex min-w-0 flex-col gap-2'>
        {players.map((player, index) => (
          <li
            key={player.name}
            className={`grid min-w-0 grid-cols-[1.25rem_2.5rem_minmax(0,1fr)_auto] items-center gap-2 rounded-2xl p-2 sm:gap-3 sm:px-3 ${
              index === 0 ? 'border border-accent/30 bg-accent/10' : 'bg-surface'
            }`}
          >
            <span className='text-sm font-semibold tabular-nums text-heading-secondary'>{index + 1}</span>
            <Mimo
              aria-hidden={true}
              name={player.name}
              size={40}
              shape='squircle'
              detailLevel='full'
              depth='none'
              interactive={false}
              className='shrink-0'
            />
            <strong className='min-w-0 truncate text-xs font-semibold text-heading sm:text-sm'>
              {player.name}
            </strong>
            <span className='whitespace-nowrap text-right text-[0.6875rem] tabular-nums text-foreground-secondary sm:text-xs'>
              {player.score.toLocaleString()} {pointsLabel}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CommentsPreview({
  heading,
  count,
  likeLabel,
  comments,
}: {
  heading: string;
  count: string;
  likeLabel: string;
  comments: Comment[];
}) {
  return (
    <div className='min-w-0'>
      <div className='mb-2 flex flex-wrap items-baseline justify-between gap-2'>
        <h4 className='text-base font-semibold tracking-[-0.02em] text-heading'>{heading}</h4>
        <span className='font-mono text-xs text-foreground-tertiary'>{count}</span>
      </div>
      <ul className='divide-y divide-divider'>
        {comments.map((comment) => (
          <li key={comment.id} className='flex min-w-0 gap-3 py-3 sm:py-4'>
            <Mimo
              aria-hidden={true}
              name={comment.author}
              size={42}
              shape='circle'
              detailLevel='full'
              depth='none'
              interactive={false}
              className='shrink-0'
            />
            <div className='min-w-0 flex-1'>
              <div className='flex flex-wrap items-baseline gap-x-2'>
                <strong className='text-sm font-semibold text-heading'>{comment.author}</strong>
                <span className='text-xs text-foreground-tertiary'>{comment.time}</span>
              </div>
              <p className='mt-1 wrap-break-word text-sm leading-relaxed text-heading-secondary'>
                {comment.text}
              </p>
              <span className='mt-2 inline-flex text-xs text-foreground-tertiary'>{likeLabel}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AvatarStackPreview({
  heading,
  caption,
  members,
}: {
  heading: string;
  caption: string;
  members: string[];
}) {
  const visibleMembers = members.slice(0, 3);

  return (
    <div className='flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex min-w-0 items-center'>
        {visibleMembers.map((name, index) => (
          <span
            key={name}
            className={`relative shrink-0 rounded-full border-2 border-background bg-surface-raised p-0.5 ${
              index === 0 ? '' : '-ml-3'
            }`}
          >
            <Mimo
              aria-hidden={true}
              name={name}
              size={42}
              shape='circle'
              detailLevel='full'
              depth='none'
              interactive={false}
            />
          </span>
        ))}
        <span className='-ml-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-background bg-surface text-xs font-semibold text-heading-secondary'>
          +{members.length - visibleMembers.length}
        </span>
      </div>
      <div className='min-w-0 sm:text-right'>
        <h4 className='text-sm font-semibold text-heading'>{heading}</h4>
        <p className='mt-1 wrap-break-word text-xs leading-relaxed text-foreground-secondary'>{caption}</p>
      </div>
    </div>
  );
}

export function ComponentUsageShowcase() {
  const t = useTranslations('components.examples');
  const typingLabel = t('chat.typing');
  const pointsLabel = t('leaderboard.points');
  const likeLabel = t('comments.like');
  const chatMessages: ChatMessage[] = [
    { id: 'kevin-1', author: 'Kevin', text: t('chat.firstMessage'), mine: true },
    { id: 'samuel', author: 'Samuel', text: t('chat.samuel'), mine: false },
    { id: 'sarah', author: 'Sarah', text: t('chat.sarah'), mine: false },
    { id: 'chloe', author: 'Chloé', text: t('chat.chloe'), mine: false },
    { id: 'kevin-2', author: 'Kevin', text: t('chat.secondMessage'), mine: true },
  ];
  const teamMembers: TeamMember[] = [
    { name: 'Camille', role: t('team.roles.design') },
    { name: 'Liam', role: t('team.roles.frontend') },
    { name: 'Ndifor', role: t('team.roles.backend') },
    { name: 'Sophia', role: t('team.roles.product') },
    { name: 'Essomba', role: t('team.roles.devRel') },
    { name: 'Maxime', role: t('team.roles.qa') },
  ];
  const players: LeaderboardPlayer[] = [
    { name: 'Francis Ngannou', score: 9820 },
    { name: 'Harper', score: 9410 },
    { name: 'Pascal Siakam', score: 8975 },
    { name: 'Juliette', score: 8540 },
    { name: 'Benjamin', score: 8122 },
    { name: 'Abena', score: 7790 },
  ];
  const comments: Comment[] = [
    { id: 'manon', author: 'Manon', time: t('comments.time'), text: t('comments.manon') },
    { id: 'james', author: 'James', time: t('comments.time'), text: t('comments.james') },
    { id: 'fotso', author: 'Fotso', time: t('comments.time'), text: t('comments.fotso') },
    { id: 'ines', author: 'Inès', time: t('comments.time'), text: t('comments.ines') },
  ];
  const chatCode = chatSnippet(chatMessages, typingLabel);
  const teamCode = teamSnippet(teamMembers);
  const leaderboardCode = leaderboardSnippet(players, pointsLabel);
  const commentsCode = commentsSnippet(comments, likeLabel);
  const stackCode = avatarStackSnippet(stackMembers);

  return (
    <section id='usage-examples' className='scroll-mt-6 pt-9 sm:pt-12'>
      <header className='mb-5 max-w-2xl'>
        <h2 className='[font-family:var(--font-serif),Georgia,serif] text-[1.625rem] leading-[1.15] font-normal tracking-[-0.02em] text-heading sm:text-[2rem]'>
          {t('title')}
        </h2>
        <p className='mt-2 text-sm leading-relaxed text-foreground-secondary'>{t('description')}</p>
      </header>

      <div className='grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-2'>
        <ComponentExampleCard
          id='group-chat-example'
          title={t('chat.title')}
          description={t('chat.description')}
          code={chatCode}
          className='lg:col-span-2'
        >
          <ChatPreview
            messages={chatMessages}
            channel={t('chat.channel')}
            heading={t('chat.heading')}
            typingLabel={typingLabel}
          />
        </ComponentExampleCard>

        <ComponentExampleCard
          id='team-directory-example'
          title={t('team.title')}
          description={t('team.description')}
          code={teamCode}
        >
          <TeamPreview
            heading={t('team.heading')}
            channel={t('team.channel')}
            leadRole={t('team.leadRole')}
            members={teamMembers}
          />
        </ComponentExampleCard>

        <ComponentExampleCard
          id='leaderboard-example'
          title={t('leaderboard.title')}
          description={t('leaderboard.description')}
          code={leaderboardCode}
        >
          <LeaderboardPreview
            heading={t('leaderboard.heading')}
            season={t('leaderboard.season')}
            pointsLabel={pointsLabel}
            players={players}
          />
        </ComponentExampleCard>

        <ComponentExampleCard
          id='comments-example'
          title={t('comments.title')}
          description={t('comments.description')}
          code={commentsCode}
          className='lg:col-span-2'
        >
          <CommentsPreview
            heading={t('comments.heading')}
            count={t('comments.count')}
            likeLabel={likeLabel}
            comments={comments}
          />
        </ComponentExampleCard>

        <ComponentExampleCard
          id='avatar-group-example'
          title={t('stack.title')}
          description={t('stack.description')}
          code={stackCode}
          className='lg:col-span-2'
        >
          <AvatarStackPreview
            heading={t('stack.heading')}
            caption={t('stack.caption')}
            members={stackMembers}
          />
        </ComponentExampleCard>
      </div>
    </section>
  );
}
