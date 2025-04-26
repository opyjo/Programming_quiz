import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p>
          Welcome to Programming Quiz App. By using our service, you agree to comply with and be bound by the following
          terms and conditions.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Programming Quiz App, you agree to be bound by these Terms and Conditions and all
          applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or
          accessing this site.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily use the materials on Programming Quiz App for personal, non-commercial
          purposes only. This is the grant of a license, not a transfer of title.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          To access certain features of the service, you may be required to create an account. You are responsible for
          maintaining the confidentiality of your account information and for all activities that occur under your
          account.
        </p>

        <h2>4. Privacy Policy</h2>
        <p>
          Your use of Programming Quiz App is also governed by our Privacy Policy, which is incorporated into these
          terms by reference.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          In no event shall Programming Quiz App be liable for any damages arising out of the use or inability to use
          the materials on the site, even if Programming Quiz App has been notified of the possibility of such damage.
        </p>

        <h2>6. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws and you irrevocably
          submit to the exclusive jurisdiction of the courts in that location.
        </p>

        <h2>7. Changes to Terms</h2>
        <p>
          Programming Quiz App reserves the right to modify these terms at any time. We will notify users of any changes
          by updating the date at the bottom of this page.
        </p>

        <p className="mt-8">Last updated: April 26, 2025</p>
      </div>
    </div>
  )
}
