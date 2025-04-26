import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "Is this platform free to use?",
      answer:
        "Yes, our platform is completely free to use. We believe in making quality programming education accessible to everyone.",
    },
    {
      question: "How are the AI-generated answers created?",
      answer:
        "We use advanced language models to generate detailed, accurate answers to programming questions. Each answer is tailored to the specific question and difficulty level.",
    },
    {
      question: "Can I suggest new questions to add to the platform?",
      answer: "We welcome suggestions for new questions. Please use the contact form to submit your ideas.",
    },
    {
      question: "How often is new content added?",
      answer:
        "We regularly update our question bank with new content across all programming categories. We aim to add new questions weekly.",
    },
    {
      question: "Can I use this platform to prepare for coding interviews?",
      answer:
        "Yes! Our platform is specifically designed to help you prepare for technical interviews by covering common interview topics and providing detailed explanations.",
    },
    {
      question: "Do I need to create an account to use the platform?",
      answer:
        "While you can access basic features without an account, creating a free account allows you to track your progress, bookmark questions, and access personalized recommendations.",
    },
    {
      question: "Are there any mobile apps available?",
      answer:
        "Currently, we offer a responsive web application that works well on mobile devices. Native mobile apps for iOS and Android are in development and will be released soon.",
    },
    {
      question: "How can I report a bug or suggest a feature?",
      answer:
        "You can report bugs or suggest features through our contact form. We appreciate your feedback and are constantly working to improve the platform.",
    },
    {
      question: "Can I use the content for my own teaching or training?",
      answer:
        "The content on our platform is for personal use only. If you're interested in using our content for teaching or training purposes, please contact us to discuss licensing options.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "You can reset your password by clicking on the 'Forgot Password' link on the sign-in page. We'll send you an email with instructions to reset your password.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we take data security seriously. We use industry-standard encryption and security practices to protect your personal information and account data.",
    },
    {
      question: "Can I delete my account?",
      answer:
        "Yes, you can delete your account at any time from your profile settings. This will permanently remove all your data from our system.",
    },
  ]

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mb-8">
          Find answers to common questions about our platform. If you can't find what you're looking for, feel free to
          contact us.
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
