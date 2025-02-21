import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  _params: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const p = await parent;
  return {
    title: 'Privacy Policy',
    description: '',
    openGraph: {
      ...(p.openGraph ?? {}),
      title: 'Privacy Policy',
      description: '',
      url: 'https://jit.dev/privacy',
    },
  };
}

export default function Page() {
  return (
    <div className="main">
      <h1 className="text-xl font-bold">Privacy Policy</h1>
      <p className="text-xs opacity-80">Last updated on June 10, 2024.</p>
      <p className="mt-2">
        This privacy policy (the "Privacy Policy") explains how we collect your
        personal data, with the strictest respect for your rights, and how that
        data is used. When we talk about "JIT", "jit.dev", "we", "our", or "us"
        in this policy, we are referring to JIT (the "Company").
      </p>
      <h2 className="mt-2 font-semibold">Personal information</h2>
      <p className="mt-2">
        We only ask for personal information when we truly need it to provide
        you with service. We collect that personal information by fair and
        lawful means and with your knowledge and consent.
      </p>
      <h2 className="mt-2 font-semibold">Data retention</h2>
      <p className="mt-2">
        We only retain collected information for as long as it's necessary to
        provide you with your requested service. What data we store, we'll
        protect and retain within commercially acceptable means to prevent loss,
        theft, unauthorised access, disclosure, copying, use or modification.
      </p>
      <h2 className="mt-2 font-semibold">Third-parties</h2>
      <p className="mt-2">
        We don't share any personally identifying information publicly or with
        third-parties, unless we're required to by law.
      </p>
      <h2 className="mt-2 font-semibold">Links to other sites</h2>
      <p className="mt-2">
        Our website may contain links to external sites that are operated by
        third-parties. Please be aware that we have no control over the content
        and terms of these sites, and we cannot accept responsibility or
        liability for their respective privacy policies.
      </p>
      <h2 className="mt-2 font-semibold">Cookies</h2>
      <p className="mt-2">
        JIT uses "cookies'' on this site. A cookie is a piece of data that is
        stored on the hard drive of a website visitor to assist us in improving
        your access to our website and identifying repeat visitors to our site.
        Cookies allow us to track and target our users' interests in order to
        improve their experience on our site and for advertising purposes. The
        use of a cookie on our website is not linked to any personally
        identifiable information. By continuing to use or navigate our website,
        you hereby acknowledge and agree to JIT's usage of cookies.
      </p>
      <h2 className="mt-2 font-semibold">Changes to this policy</h2>
      <p className="mt-2">
        We reserve the right to modify our Privacy Policy at any time. Changes
        and updates will take effect immediately upon going live on our website.
        JIT advises its visitors to frequently visit this page to check for any
        changes to its Privacy Policy. Your continued use of this site after any
        change will confirm your acceptance of those changes.
      </p>
      <h2 className="mt-2 font-semibold">Contact</h2>
      <p className="mt-2">
        If you would like to ask any questions or provide feedback regarding
        this Privacy Policy, please reach out to us at{' '}
        <a href={'mailto:support@jit.dev'}>support@jit.dev</a>.
      </p>
    </div>
  );
}
