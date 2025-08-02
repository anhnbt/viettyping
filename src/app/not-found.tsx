import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-6">😕</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Không tìm thấy trang
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            🏠 Về trang chủ
          </Link>
          <br />
          <Link
            href="/typing"
            className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            ⌨️ Luyện gõ phím
          </Link>
        </div>
      </div>
    </main>
  );
}
