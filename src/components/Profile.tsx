import Image from 'next/image';

interface ProfileProps {
  name: string;
  bio: string;
  imageSrc: string;
}

const Profile: React.FC<ProfileProps> = ({ name, bio, imageSrc }) => {
  return (
    <div className="flex flex-col items-center space-y-4 w-full mx-auto px-2 mb-4">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-(--accent) shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95">
        <Image
          src={imageSrc}
          alt={`${name}'s profile photo`}
          fill
          className="object-cover"
          priority
          sizes="128px"
          quality={75}
        />
      </div>

      <div className="text-center w-full">
        <h1 className="text-2xl font-bold text-(--text-primary) mb-2">{name}</h1>

        <div className="w-full max-w-2xl mx-auto px-4">
          <p className="mx-auto px-2 sm:px-8 text-base sm:text-lg text-center text-(--text-secondary) whitespace-normal">
            {bio}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
