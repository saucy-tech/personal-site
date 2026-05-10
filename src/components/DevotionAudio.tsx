import { SpeakerWaveIcon } from '@heroicons/react/24/outline';

interface DevotionAudioProps {
  src: string;
  title: string;
}

export default function DevotionAudio({ src, title }: DevotionAudioProps) {
  return (
    <section
      aria-label="Listen to this devotion"
      className="rounded-3xl border border-(--accent-border) bg-(--accent-transparent) p-5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <SpeakerWaveIcon className="h-5 w-5 text-(--accent)" aria-hidden="true" />
        <p className="text-xs uppercase tracking-[0.18em] text-(--accent)">Listen</p>
      </div>
      <audio
        controls
        preload="metadata"
        src={src}
        className="mt-4 w-full"
        aria-label={`Audio recording of ${title}`}
      >
        Your browser does not support the audio element.{' '}
        <a href={src} className="text-(--accent) underline">
          Download the recording
        </a>
        .
      </audio>
    </section>
  );
}
