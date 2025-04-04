import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { SITE_DESCRIPTION } from '@/utils/constants';

export default function AlternateHome() {
  return (
    <div className="space-y-12 container mx-auto px-4 py-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {SITE_DESCRIPTION}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">Software Development</h2>
          <p className="text-gray-600 mb-4">
            Building scalable and maintainable software solutions with modern technologies.
          </p>
          <Button variant="outline">Learn More</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">Exploring Ideas</h2>
          <p className="text-gray-600 mb-4">
            Sharing thoughts and insights about technology, innovation, and personal growth.
          </p>
          <Button variant="outline">Read Blog</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">Bitcoin & Finance</h2>
          <p className="text-gray-600 mb-4">
            Exploring the intersection of technology and sound money through Bitcoin.
          </p>
          <Button variant="outline">Discover More</Button>
        </Card>
      </section>
    </div>
  );
}

