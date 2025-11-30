import { HelpCircle, MessageSquare, FileText } from "lucide-react";

export default function Help() {
  const faqs = [
    {
      question: "How do I post a gig?",
      answer:
        "Navigate to the 'Post a Gig' page from the dashboard or navigation menu. Fill in the details about the job, payment, and requirements.",
    },
    {
      question: "Is UniGigs free to use?",
      answer:
        "Yes, UniGigs is completely free for students to post and find gigs.",
    },
    {
      question: "How do I get paid?",
      answer:
        "Payment arrangements are made directly between the gig poster and the student. UniGigs facilitates the connection but does not process payments.",
    },
    {
      question: "Can I delete my account?",
      answer: "Yes, you can request account deletion by contacting support.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-lg text-center">How can we help?</h1>

      <div className="grid md:grid-cols-3 gap-md mb-xl">
        <div className="card text-center p-lg hover:border-[var(--color-primary)] transition-colors cursor-pointer">
          <div className="bg-[var(--color-primary)]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-md text-[var(--color-primary)]">
            <FileText size={24} />
          </div>
          <h3 className="font-semibold mb-xs">Documentation</h3>
          <p className="text-sm text-muted">Read our guides</p>
        </div>
        <div className="card text-center p-lg hover:border-[var(--color-primary)] transition-colors cursor-pointer">
          <div className="bg-[var(--color-secondary)]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-md text-[var(--color-secondary)]">
            <MessageSquare size={24} />
          </div>
          <h3 className="font-semibold mb-xs">Chat Support</h3>
          <p className="text-sm text-muted">Talk to us</p>
        </div>
        <div className="card text-center p-lg hover:border-[var(--color-primary)] transition-colors cursor-pointer">
          <div className="bg-[var(--color-accent)]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-md text-[var(--color-accent)]">
            <HelpCircle size={24} />
          </div>
          <h3 className="font-semibold mb-xs">FAQs</h3>
          <p className="text-sm text-muted">Common questions</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-lg">Frequently Asked Questions</h2>
        <div className="space-y-md">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-[var(--color-border)] last:border-0 pb-md last:pb-0"
            >
              <h3 className="font-semibold mb-xs">{faq.question}</h3>
              <p className="text-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
