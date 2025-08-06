// Columns are only used when parsing from CSV files.
export const sampleConfig = {
  project_name: "SampleProject",
  logid_template: "D<dd>_<yymmdd>",
  unit: "main",
  match_sound: true,
  match_schema: true,
  custom_schemas: [
    {
      id: "myCustomSchema",
      sync: "clip",
      order: 1,
      active: true,
      csv_parsing: false,
      log_fields: [
        {
          type: "text",
          key_name: "director",
        },
        {
          type: "text",
          key_name: "dop",
        },
      ],
      clip_fields: [
        {
          type: "clip",
        },
        {
          type: "text",
          key_name: "CustomText",
        },
        {
          type: "text_list",
          key_name: "CustomTextList",
          delimiter: ",",
        },
        {
          type: "text_list_list",
          key_name: "CustomTextListList",
          primary_delimiter: ",",
          secondary_delimiter: "|",
        },
        {
          type: "kv_map",
          key_name: "CustomKVmap",
          primary_delimiter: ";",
          secondary_delimiter: ":",
        },
        {
          type: "kv_map_list",
          key_name: "CustomKVmapList",
          subfields: [
            { key_name: "TC" },
            { key_name: "urgency" },
            { key_name: "issue" },
          ],
          primary_delimiter: ",",
          secondary_delimiter: "|",
        },
      ],
    },
  ],
  emails: [
    {
      id: "asoyc",
      label: "End of day",
      recipients: ["producer@example.com", "post@example.com"],
      subject: "Log for <log>",
      attachments: ["rsCuv"],
      react: "DaySummary.tsx",
      enabled: true,
    },
    {
      id: "gYI08",
      label: "End of Production",
      recipients: ["producer@example.com", "post@example.com"],
      subject: "Thanks for this time!",
      react: "ProducionSummary.tsx",
      enabled: true,
    },
    {
      id: "XJSfY",
      label: "QC issue",
      recipients: ["post@example.com"],
      subject: "<project> - Found an issue that requires your attention",
      react: "QcIssue.tsx",
      enabled: true,
    },
    {
      id: "QiONq",
      label: "Email to soundguy",
      recipients: ["soundguy@example.com"],
      subject: "Sound Offload Summary for <log>",
      react: "SoundDaySummary.tsx",
      enabled: true,
    },
  ],
  pdfs: [
    {
      id: "rsCuv",
      label: "Clips report",
      output_name: "Clips_Day<dd>_<yymmdd>.pdf",
      react: "ClipsReport.tsx",
      enabled: true,
    },
  ],
  version: 1,
};
