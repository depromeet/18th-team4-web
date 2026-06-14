import { type Metadata } from 'next';
import { BookDetailContainer } from '@/components';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: 'Readum:책 상세',
  description: 'Readum:사유하는 독서가인 당신을 위해',
});

type Props = {
  params: Promise<{ bookId: string }>;
};

const page = async (props: Props) => {
  const { bookId } = await props.params;

  return <BookDetailContainer bookId={bookId} />;
};

export default page;
