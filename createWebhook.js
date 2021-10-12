const axios = require("axios");

// call this function:
// export YOUR_API_TOKEN=[your api token]
// node createWebhook.js

axios({
  url: "https://app.asana.com/api/1.0/webhooks",
  method: "post",
  headers: {
    Authorization: `Bearer ${process.env.YOUR_API_TOKEN}`,
  },
  data: {
    // fill this in as per https://developers.asana.com/docs/establish-a-webhook
    data: {
      filters: [
        {
          action: "added",
          resource_type: "task",
        },
      ],
      // gid for a project, task, portfolio, etc:
      resource: "",
      // get the target URLfrom your labmda function config. it should look like "https://abcd12345.execute-api.us-east-1.amazonaws.com/Prod/bot"
      // you can also add URL params to this url, if you are setting multiple webhooks and want your app to have additional context as to which trigger this refers to, or which X-Hook-Secret value to fetch
      // like "https://abcd12345.execute-api.us-east-1.amazonaws.com/Prod/bot?webhookNumber=1"
      target: "",
    },
  },
}).then((res) => {
  console.log(res.data);
});
