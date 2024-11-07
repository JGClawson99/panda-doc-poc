import { z } from "zod";
import * as pd_api from "pandadoc-node-client";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const documentRouter = createTRPCRouter({


//   create: protectedProcedure
//     .input(z.object({ name: z.string().min(1) }))
//     .mutation(async ({ ctx, input }) => {
//       return ctx.db.post.create({
//         data: {
//           name: input.name,
//           createdBy: { connect: { id: ctx.session.user.id } },
//         },
//       });
//     }),



  getTemplates: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({ where: { id: input.id } });
    console.log(user)
    const API_KEY = process.env.PANDADOC_API_KEY;
    let cfg = pd_api.createConfiguration({
        authMethods: { apiKey: `API-Key ${API_KEY}` }, // or authMethods: {oauth2: `Bearer ${OAUTH2_KEY}`}
        baseServer: new pd_api.ServerConfiguration(
          // Defining the host is optional and defaults to https://api.pandadoc.com
          "https://api.pandadoc.com",
          {}
        ),
      });
const apiInstance = new pd_api.DocumentsApi(cfg);
// const apiInstance = new pd_api.TemplatesApi(configuration);
// const data = await apiInstance.listTemplates({ deleted: false, q: "Sample Invoice" }) 

const pricingTables: Array<pd_api.PricingTableRequest> = [
    {
      name: "Pricing Table 1",
      options: {
        Discount: {
          type: "absolute",
          name: "Global Discount",
          value: 2.26,
        },
        Tax: {
          type: "percent",
          name: "Tax First",
          value: 2.26,
        },
      },
      sections: [
        {
          title: "Sample Section",
          _default: true,
          multichoiceEnabled: false,
          rows: [
            {
              options: {
                qtyEditable: true,
                optionalSelected: true,
                optional: true,
              },
              data: {
                "name": "Toy Panda",
                "description": "Fluffy",
                "price": 10,
                "cost": 8.5,
                "qty": 3,
                "sku": "toy_panda",
                "discount": {
                  "value": 10,
                  "type": "percent"
                },
                "Tax": {
                  "value": 10,
                  "type": "percent"
                }
              },
              customFields: {},
            },
          ],
        },
      ],
    },
];

const documentCreateRequest: pd_api.DocumentCreateRequest = {
    name: "API Sample Document from PandaDoc Template",
    templateUuid: '3VjUePQr9EPyfdWdB3x3TG',
    // specify a folder uuid if you want to document to be created
    // in specific folder otherwise it will be created in root directory
    //
    // folderUuid: "YOUR_FOLDER_ID",
    recipients: [
      {
        email: "taylor@remihq.com",
        firstName: "Taylor",
        lastName: "Miller",
        signingOrder: 1,
      },
    ],
    tokens: [
      {
        name: "Sender.FirstName",
        value: "Taylor",
      },
      {
        name: "Client.FirstName",
        value: user?.name ?? "",
      },
      {
        name: "Client.Address",
        value: user?.email ?? "",
      },
      {
        name: "Client.Phone",
        value: user?.phoneNumber ?? "",
      },
      {
        name: "Invoice.No",
        value: user?.id ?? "",
      },
    ],
    fields: {},
    metadata: {},
    tags: ["created_via_api", "test_document"],
    images: [
      {
        urls: [
          user?.image ?? "",
        ],
        name: "Image 1",
      },
    ],
    pricingTables: pricingTables,
    // contentPlaceholders: [
    //   {
    //     blockId: "Content Placeholder 1",
    //     contentLibraryItems: [
    //       {
    //         id: "MtbPjKiupsgjc9KKDyjVzE",
    //         pricingTables: pricingTables,
    //       },
    //     ],
    //   },
    // ],
    url: "https://s3.amazonaws.com/pd-static-content/public-docs/pandadoc-panda-bear.png",
    parseFormFields: false,
  };
  async function documentSend(
    apiInstance: pd_api.DocumentsApi,
    document: pd_api.DocumentCreateResponse
  ): Promise<void> {
    await apiInstance.sendDocument({
      id: String(document.id),
      documentSendRequest: {
        silent: false,
        subject: "Sent via Node SDK",
        message: "This document was sent via Node SDK example",
      },
    });
  }

  async function ensureDocumentCreated(
    apiInstance: pd_api.DocumentsApi,
    document: pd_api.DocumentCreateResponse
  ): Promise<void> {
    /*
      Document creation is non-blocking (asynchronous) operation.
  
      With a successful request, you receive a response with the created
      document's ID and status document.uploaded.
      After processing completes on our servers, usually a few seconds,
      the document moves to the document.draft status.
      Please wait for the webhook call or check this document's
      status before proceeding.
  
      The change of status from document.uploaded to another status signifies
      the document is ready for further processing.
      Attempting to use a newly created document before PandaDoc servers
      process it will result in a '404 document not found' response.
       */
    // let status = document.status;
    const MAX_CHECK_RETRIES = 10;
    let retries = 0;
  
    while (retries < MAX_CHECK_RETRIES) {
      await new Promise((r) => setTimeout(r, 2000));
      retries++;
  
      let response = await apiInstance.statusDocument({
        id: String(document.id),
      });
      if (response.status === "document.draft") {
        return;
      }
    }
  
    throw Error("Document was not sent");
  }

  const data = await apiInstance.createDocument({
    documentCreateRequest: documentCreateRequest,
  });
  await ensureDocumentCreated(apiInstance, data);
  await documentSend(apiInstance, data);
return data ?? null
  }),





});
