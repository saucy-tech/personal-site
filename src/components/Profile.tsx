import Image from 'next/image';

interface ProfileProps {
  name: string;
  bio: string;
  imageSrc: string;
}

/** Homepage identity block: avatar beside the name and bio, stacked and centered on phones. */
const Profile: React.FC<ProfileProps> = ({ name, bio, imageSrc }) => {
  return (
    <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-full border-[3px] border-(--accent) sm:size-24">
        <Image
          src={imageSrc}
          alt={`${name}'s profile photo`}
          width={96}
          height={96}
          className="h-full w-full object-cover"
          priority
          fetchPriority="high"
        />
      </div>

      <div className="min-w-0 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-(--text-primary) sm:text-4xl">
          {name}
        </h1>
        <p className="mt-1.5 text-base text-center text-(--text-secondary) whitespace-normal text-balance sm:text-left sm:text-lg">
          {bio}
        </p>
      </div>
    </div>
  );
};

export default Profile;
