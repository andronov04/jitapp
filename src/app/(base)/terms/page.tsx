import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  _params: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const p = await parent;
  return {
    title: 'Terms of Service',
    description: '',
    openGraph: {
      ...(p.openGraph ?? {}),
      title: 'Terms of Service',
      description: '',
      url: 'https://jit.dev/terms',
    },
  };
}

export default function Page() {
  return (
    <div className="main">
      <h1 className="text-xl font-bold">Terms of Service</h1>
      <p className="text-xs opacity-80">Last updated on June 10, 2024.</p>
      <p className="mt-2">
        This website is operated by JIT (the "Company"). Throughout the site,
        the terms "JIT", "jit.dev", "we", "us", "our", and the "Service" refer
        to JIT. JIT offers this website, including all information, tools and
        services available from this site to you, the user, conditioned upon
        your acceptance of all terms, conditions, policies and notices stated
        here.
      </p>
      <p className="mt-2">
        By visiting our site and/or making an enquiry, you engage in the "Use"
        of our site and agree to be bound by the following terms and conditions
        ("Terms of Service", "Terms"), including those additional terms and
        conditions and policies referenced herein and/or available by hyperlink.
        These Terms of Service apply to all users of the site, including without
        limitation users who are browsers, vendors, customers, and/or
        contributors of content.
      </p>
      <p className="mt-2">
        Please read these Terms of Service carefully before accessing or using
        our website. By accessing or using any part of the site, you agree to be
        bound by these Terms. If you do not agree to all the terms and
        conditions of this agreement, then you may not access the website or use
        any services.
      </p>
      <p className="mt-2">
        Any new features or information which are added to the site shall also
        be subject to the Terms of Service. You can review the most current
        version of the Terms of Service at any time on this page. We reserve the
        right to update, change or replace any part of these Terms of Service by
        posting updates and/or changes to our website. It is your responsibility
        to check this page periodically for changes. Your continued use of or
        access to the website following the posting of any changes constitutes
        acceptance of those changes.
      </p>
      <h2 className="mt-2 font-semibold">Disclaimer</h2>
      <p className="mt-2">
        JIT is provided on an "as is'' and "as available" basis. While we strive
        to provide accurate and reliable information, we do not assume liability
        for the completeness, usefulness, or accuracy of the data available on
        its site. We are not responsible for any data posted or sent by you,
        other users, or third parties on our site. We shall not be held liable
        for any improper or incorrect use of the information provided on the
        site and assume no responsibility for how the information is utilized.
        You are solely responsible for your data and the consequences of
        uploading or submitting it.
      </p>
      <p className="mt-2">
        Please be aware that when you, as a user, utilize third-party services,
        your interactions with them will be governed by their respective terms
        and privacy policies. JIT is not responsible for the content or
        materials found on any third-party websites. We do not control the
        privacy practices of such third-party services and, therefore, cannot be
        held liable for any loss or damage that may arise from your use of any
        third-party content.
      </p>
      <p className="mt-2">
        It is essential to understand that JIT has no control over the accuracy
        of information provided by these third-party services. Data on our
        Service may occasionally contain technical inaccuracies or typographical
        errors, and we make no guarantees regarding the authenticity, accuracy,
        quality, copyright compliance, legality, or any other aspect of such
        information. As a result, any loss or damage incurred from using such
        information is beyond our responsibility.
      </p>
      <p className="mt-2">
        By accessing and/or using the data provided through JIT, you acknowledge
        and agree that we are not liable for any kind of damages, losses, or
        actions arising directly or indirectly from your interaction with and
        use of the data. It is your responsibility to exercise caution and
        diligence when relying on any information from third-party sources.
      </p>
      <p className="mt-2">
        JIT shall not be held liable for any loss, damage, or inconvenience
        resulting from your inability to access or use the Service during
        periods of downtime or discontinuance of the service. These terms of
        service do not impose any obligation on us to maintain and support the
        site or provide any corrections, updates, or releases related to it.
      </p>
      <p className="mt-2">
        We disclaim all warranties, whether express or implied, including but
        not limited to warranties of merchantability, fitness for a particular
        purpose, and non-infringement.
      </p>
      <h2 className="mt-2 font-semibold">Accessing and Using the Website</h2>
      <p className="mt-2">
        By accessing the website at JIT, you are agreeing to be bound by these
        terms of service, all applicable laws and regulations, and agree that
        you are responsible for compliance with any applicable local laws. If
        you do not agree with any of these terms, you are prohibited from using
        or accessing this site. The materials contained in this website are
        protected by applicable copyright and trademark law.
      </p>
      <h2 className="mt-2 font-semibold">Services</h2>
      <p className="mt-2">
        As a subscriber to the JIT service, you are entitled to receive
        assistance with your problems and ideas and contact our team if or when
        needed. As a promise, we try to answer every request as quickly as
        possible.
      </p>
      <h2 className="mt-2 font-semibold">Billing and Refunds</h2>
      <p className="mt-2">
        We charge you for access to the product in monthly and yearly plans. Due
        to the nature of our product, we currently do not offer refunds, either
        partial or in full. You can easily cancel your subscription at any time
        you like. We will no longer charge you anything once you cancel your
        subscription. We may change our pricing, pricing policies, features and
        access restrictions at any time.
      </p>
      <h2 className="mt-2 font-semibold">Content</h2>
      <p className="mt-2">
        Our Services allows you to post, link, store, share and otherwise make
        available certain information, text, graphics, videos, photos, works of
        authorship, creative works or other material ("Content"). You are
        responsible for Content that you post on or through our Services,
        including its legality, reliability, and appropriateness.
      </p>
      <h2 className="mt-2 font-semibold">Accounts</h2>
      <p className="mt-2">
        Accounts can be used by anyone on your team, but if we notice any
        suspicious actions, we reserve the right to terminate your account until
        the actions are justified or clarified. Using a company or business
        name, username, logo, or other trademark-protected materials in a manner
        that may mislead or confuse others with regard to its brand or business
        affiliation may be considered a trademark policy violation.
      </p>
      <h2 className="mt-2 font-semibold">Third Party Resources</h2>
      <p className="mt-2">
        Certain items of software used as part of the Service are subject to
        "open sources" and/or "free software" licenses ("Third-Party
        Resources"). Some of these items are owned by third parties. These
        Third-Party Resources are subject to the terms of the end-user license
        agreement that accompanies such resources. JIT is not responsible for
        Third-Party Resources, and you assume responsibility and risk for using
        these Third-Party Resources.
      </p>
      <h2 className="mt-2 font-semibold">Termination</h2>
      <p className="mt-2">
        We reserve the right to terminate or suspend your access to our service
        at any time, and without prior notice or liability, for any reason,
        including, without limitation, if you violate the Terms. All provisions
        of the Terms that, by their nature, must survive termination, including,
        but not limited to, ownership provisions, warranty disclaimers,
        indemnity, and liability limitations, shall survive termination.
      </p>
      <h2 className="mt-2 font-semibold">Links to Other Sites</h2>
      <p className="mt-2">
        Our website may contain links to external sites that are operated by
        third-parties. Please be aware that we have no control over the content
        and terms of these sites, and we cannot accept responsibility or
        liability for their respective privacy policies.
      </p>
      <h2 className="mt-2 font-semibold">Modification</h2>
      <p className="mt-2">
        We reserve the right to modify these Terms of Service at any time.
        Changes and updates will take effect immediately upon going live on our
        website. JIT advises its visitors to frequently visit this page to check
        for any changes to its Terms of Service. We'll notify you if and when we
        make changes to our Terms.
      </p>
      <h2 className="mt-2 font-semibold">Contact</h2>
      <p className="mt-2">
        If you would like to ask any questions or provide feedback regarding
        this Licensing Agreement, please reach out to us at{' '}
        <a href={'mailto:support@jit.dev'}>support@jit.dev</a>.
      </p>
    </div>
  );
}
