<h1 align="center">
  <br>
  📩 MTA-STS Policy file on GitHub or Cloudflare Worker
  <br>
</h1>

<p align="center">
  <a href="#how-to-use-with-github-pages">Github Pages</a> •
  <a href="#how-to-use-with-cloudflare-worker">Cloudflare Workers</a>
</p>

<h4 align="center">Use this template to host your <i>MTA Strict Transport Security (MTA-STS)</i> <a href="https://datatracker.ietf.org/doc/html/rfc8461">[RFC 8461]</a> policy file on GitHub Pages or as a cloudflare worker.</h4>

MTA-STS is a security standard to secure e-mail delivery. E-mail servers that send inbound e-mail to your domain will be able to detect that your e-mail server supports SMTP-over-TLS via `STARTTLS` (also known as [Opportunistic TLS](https://en.wikipedia.org/wiki/Opportunistic_TLS)) before opening the actual connection.

In case the sending e-mail server is not able to initiate a secure connection, it will end the connection to enforce transport layer encryption. This mitigates [Man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) DNS and SMTP [downgrade attacks](https://en.wikipedia.org/wiki/Downgrade_attack) that would allow an attacker to read or manipulate e-mail in transit.

## How To use with Github pages

1. Make sure you are [signed in to GitHub](https://github.com/login). Then click on [**Use this template**](https://github.com/BourbonCrow/email/generate) to create a copy to your own GitHub profile (see [GitHub Docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)). Don't _clone_ the repository.
   You may name your repository whatever you like. For simplicity, you can name it `mta-sts.<your_domain.tld>`.

2. Change the file `.well-known/mta-sts.txt` according to your needs.

3. Create a `CNAME` record for `mta-sts.<your_domain.tld>` in your domain's DNS that points to `<you_username>.github.io` or `<your_organization>.github.io` and [enable GitHub Pages](https://docs.github.com/articles/using-a-custom-domain-with-github-pages/).

4. Open a browser to `https://mta-sts.<your_domain.tld>` and make sure it does not show any certificate warnings.

5. Continue <a href="#required-steps-for-both-alternatives">below</a>.


## How To Use with Cloudflare Worker

1. Make sure your domain is on [Cloudflare](https://dash.cloudflare.com/) by either registering it there or changing nameserver on your registrar to cloudflare name servers.

2. Click on Workers & Pages > Overview and `Create Worker` and name it whatever you like and deploy.

3. Edit the worker you just made and copy one of the scripts that fits you most from this [folder](https://github.com/BourbonCrow/email/tree/main/.cloudflare-workers), Edit the content according to your needs like below.

*note: these are not the full scripts these are setting examples, full scripts [here](https://github.com/BourbonCrow/email/tree/main/.cloudflare-workers)

Global file Proton Mail example:
```js
const stsPolicies =
`version: STSv1
mode: enforce
mx: mail.protonmail.ch
mx: mailsec.protonmail.ch
max_age: 86400`
```
MultiDomain file example:
```js
const stsPolicies = {
  "yourdomain1.com":
`version: STSv1
mode: enforce
mx: mail.yourdomain1.com
mx: mailsec.yourdomain1.com
max_age: 86400`,
  "yourdomain2.com":
`version: STSv1
mode: enforce
mx: mail.yourdomain2.com
max_age: 86400`,
  "yourdomain3.com":
`version: STSv1
mode: enforce
mx: mail.yourdomain3.com
mx: mailsec.yourdomain3.com
max_age: 86400`
}
```

5. Create a `AAAA` record for `mta-sts.<your_domain.tld>` in your domain's DNS that points to `100::` and make sure Proxy Status is Enabled.

6. Go to Workers Routes and `Add route` and set route to `mta-sts.<yourdomain.tld>/*` and set the worker to the one you made.

7. Open a browser to `https://mta-sts.<your_domain.tld>` and make sure it does not show any certificate warnings.

8. Continue <a href="#required-steps-for-both-alternatives">below</a>


## Required steps for both alternatives

1. Create a `TXT` record for `_mta-sts.<your_domain.tld>` in your domain's DNS to enable the MTA-STS policy for your domain.
   You may copy & paste this to your DNS provider:

   ```dns
   #HOST       #TTL    #TYPE    #VALUE
   _mta-sts    3600    TXT      "v=STSv1; id=20220317000000Z"
   ```

   **Note that you will need to change the `id=` here whenever you make changes to your `mta-sts.txt` policy file.**
   

2. Validate your setup, for example by using the [MTA-STS Lookup by MXToolBox](https://mxtoolbox.com/mta-sts.aspx), or looking into your [Hardenize Public Report](https://www.hardenize.com/).

### *Optional (but __highly recommended__):*

3. Create another `TXT` record for `_smtp._tls.<your_domain.tld>` in your domain's DNS to enable reporting (see [RFC 8460](https://datatracker.ietf.org/doc/html/rfc8460)).
   You may copy & paste this to your DNS provider:

   ```dns
   #HOST         #TTL    #TYPE    #VALUE
   _smtp._tls    3600    TXT      "v=TLSRPTv1; rua=mailto:tls-rua@mailcheck.<your_domain.tld>"
   ```

   Note that the e-mail recipient mailbox shall be on a different domain _without_ MTA-STS being configured. This could be a subdomain like `mailcheck.<your_domain.tld>`.
   It is also quite painful to manually deal with the reports other e-mail providers will send to you. For that particular reason, you may want to consider sending these e-mails to a 3rd-party tool like [Report URI](https://report-uri.com/), [URIports](https://www.uriports.com/), or from other commercial providers.
   
   You probably want this to be the same tool you might use for DMARC reports, like [DMARC Analyzer](https://www.dmarcanalyzer.com/) or [Dmarcian](https://dmarcian.com/).
