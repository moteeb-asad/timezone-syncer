import { Link } from "react-router-dom";
import { LegalPage } from "@/components/legal/LegalPage";

export const Privacy = () => (
  <LegalPage title="Privacy policy" updated="12 November 2026">
    <section>
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>From Google, when you sign in:</strong> your name, email
          address and profile photo.
        </li>
        <li>
          <strong>What you add:</strong> your cities, your base time and working
          hours, and the meetings you plan (subject, guest email addresses,
          time, timezone and any note you write).
        </li>
        <li>
          <strong>Your plan:</strong> whether you are on Free or Pro.
        </li>
        <li>
          <strong>Your calendar, only if you open timezone tax:</strong>{" "}
          read-only access to your Google Calendar events, used in your browser
          to count meetings outside your working hours. We store only the
          monthly totals, never your event titles or guests.
        </li>
      </ul>
    </section>

    <section>
      <h2>Without an account</h2>
      <p>
        If you use Timezone Syncer without signing in, your cities stay in your
        browser's local storage. Nothing is sent to us.
      </p>
    </section>

    <section>
      <h2>How we use it</h2>
      <p>
        Only to run the app: to save your cities across devices, show working
        status, suggest meeting times and open invites in Google Calendar. We
        don't sell your data, show ads or use tracking analytics.
      </p>
    </section>

    <section>
      <h2>Where it is stored</h2>
      <p>
        Your account and data are stored with Google Firebase (Authentication
        and Cloud Firestore). The site is hosted on Vercel. Both process data on
        our behalf only to provide the service.
      </p>
    </section>

    <section>
      <h2>The demo account</h2>
      <p>
        The demo account is shared. Anything you add while using it is visible
        to other visitors, so don't enter real names or email addresses there.
      </p>
    </section>

    <section>
      <h2>Your choices</h2>
      <ul>
        <li>Remove cities and meetings at any time.</li>
        <li>
          Disconnect Google Calendar from your account, or revoke access in your
          Google account settings.
        </li>
        <li>
          Ask us to delete your account and all its data through the{" "}
          <Link to="/contact">contact page</Link>.
        </li>
      </ul>
    </section>

    <section>
      <h2>Changes</h2>
      <p>
        If this policy changes, we'll update the date at the top of this page.
      </p>
    </section>
  </LegalPage>
);
