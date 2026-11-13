import { Link } from "react-router-dom";
import { LegalPage } from "@/components/legal/LegalPage";

export const Terms = () => (
  <LegalPage title="Terms of use" updated="12 November 2026">
    <section>
      <h2>Using Timezone Syncer</h2>
      <p>
        Timezone Syncer helps you compare times across cities and plan meetings.
        By signing in or using the app, you agree to these terms and to our{" "}
        <Link to="/privacy">privacy policy</Link>.
      </p>
    </section>

    <section>
      <h2>Your account</h2>
      <ul>
        <li>You sign in with your own Google account.</li>
        <li>You are responsible for what you add, including guest emails.</li>
        <li>
          The demo account is shared with other visitors. Don't put personal or
          confidential information in it.
        </li>
      </ul>
    </section>

    <section>
      <h2>Fair use</h2>
      <p>Please don't:</p>
      <ul>
        <li>create accounts automatically or in bulk</li>
        <li>try to access other people's data or get around plan limits</li>
        <li>overload, scrape or attack the service</li>
        <li>use it to send spam invites</li>
      </ul>
      <p>We may suspend accounts that do these things.</p>
    </section>

    <section>
      <h2>Free and Pro</h2>
      <p>
        The Free plan has limits, such as the number of compared cities. Pro
        features and prices are shown on the{" "}
        <Link to="/premium">Premium page</Link>.
      </p>
    </section>

    <section>
      <h2>Times and suggestions</h2>
      <p>
        We work hard to get time zones and daylight saving right, but the app is
        provided as it is. Check important meeting times before you rely on
        them. We aren't liable for missed or mistimed meetings.
      </p>
    </section>

    <section>
      <h2>Changes and ending</h2>
      <p>
        We may change these terms or the service; the date at the top shows the
        latest version. You can stop using the app and ask us to delete your
        account at any time through the <Link to="/contact">contact page</Link>.
      </p>
    </section>
  </LegalPage>
);
