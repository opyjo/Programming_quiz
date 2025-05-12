import Link from "next/link";

const topics = [
  {
    name: "Web Development",
    href: "/topics/web-development",
    description: "HTML, CSS, JavaScript, React, and more.",
  },
  {
    name: "JavaScript Frameworks",
    href: "/topics/javascript-frameworks",
    description: "Modern JS frameworks and libraries.",
  },
  {
    name: "Java",
    href: "/topics/java",
    description: "OOP principles, Java ecosystem, and enterprise patterns.",
  },
];

export default function TopicsPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Quiz Topics</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
        {topics.map((topic) => (
          <Link
            key={topic.href}
            href={topic.href}
            className="block rounded-lg border p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            tabIndex={0}
            aria-label={`Go to ${topic.name} topic`}
          >
            <h2 className="text-xl font-bold mb-2">{topic.name}</h2>
            <p className="text-muted-foreground">{topic.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
