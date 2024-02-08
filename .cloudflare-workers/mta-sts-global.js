// This worker is designed to be able to neatly handle MTA-STS policies for multiple domains that use the exact same txt records for example Proton Mail using own domain.

// Make a new worker with this script and add your domains to the stsPolicies dict like the example.
// Add a DNS AAAA record for mta-sts.yourdomain.com pointing to 100:: and set to proxied,
// then add a workers route for mta-sts.yourdomain.com/* pointing to this worker.

// You'll still need to manually add the appropriate _mta-sts.yourdomain.com TXT record to enable the policy, 
// and the _smtp._tls.yourdomain.com TXT record for reporting.

const stsPolicies =
`version: STSv1
mode: enforce
mx: mail.protonmail.ch
mx: mailsec.protonmail.ch
max_age: 86400`

async function handleRequest(request) {
  return new Response(stsPolicies, {
    headers: {
      "content-type": "text/plain;charset=UTF-8",
    },
  })
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request))
})
