import {db} from '@/lib/db';
import Link from 'next/link';

const SolutionsPage = async () => {
  const solutions = await db.solution.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: true,
      Problem: true,
    },
  });

  return (
    <div className='container py-8'>
      <h1 className='text-3xl font-bold mb-4'>Solutions</h1>
      <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4'>
        {solutions.map((solution) => (
          <Link
            key={solution.id}
            href={`/solution/${solution.id}`}
            className='bg-white p-4 rounded-md shadow-md'
          >
            <h4 className='text-xl font-bold'>
              {solution.title.split(" ").slice(0, 7).join(" ")}
              {solution.title.split(" ").length > 7 && "..."}
            </h4>
            <p className='mt-2 text-gray-600 line-clamp-3'>
              {String(solution.content ?? "").split(" ").slice(0, 23).join(" ")}
              {String(solution.content ?? "").split(" ").length > 23 && "..."}
            </p>
            <p>Published by: {solution.author?.firstName} {solution.author?.lastName}</p>
            <i>For Problem: {solution.Problem?.title}</i>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SolutionsPage;
