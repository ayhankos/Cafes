export default function Footer() {
  return (
    <footer className=" bot-0 left-0 right-0 z-50">
      <div className="max-w-8xl mx-auto py-4 px-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <img
            src="/logo.png"
            alt="Cafe Website Logo"
            className="h-20 w-auto"
          />
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a
                href="/about"
                target="_blank"
                className="hover:underline me-4 md:me-6"
              >
                Hakkımızda
              </a>
            </li>
            <li>
              <a
                href="/privacy"
                target="_blank"
                className="hover:underline me-4 md:me-6"
              >
                Gizlilik Politikası
              </a>
            </li>
            <li>
              <a
                href="/licensing"
                target="_blank"
                className="hover:underline me-4 md:me-6"
              >
                Lisanslar
              </a>
            </li>
            <li>
              <a href="/contact" target="_blank" className="hover:underline">
                İletişim
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
