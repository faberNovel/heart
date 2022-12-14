import { TableMetadata } from "@google-cloud/bigquery/build/src/table"

export class Definitions {
  public static readonly DATASET: { ID: string } = {
    ID: "heart",
  }

  public static readonly TABLE: { ID: string; METADATA: TableMetadata } = {
    ID: "analysis",
    METADATA: {
      schema: {
        fields: [
          {
            name: "date",
            type: "DATETIME",
            mode: "REQUIRED",
          },
          {
            name: "url",
            type: "RECORD",
            mode: "REQUIRED",
            fields: [
              {
                name: "analyzed",
                type: "STRING",
                mode: "REQUIRED",
              },
              {
                name: "report",
                type: "STRING",
                mode: "NULLABLE",
              },
            ],
          },
          {
            name: "service",
            type: "RECORD",
            mode: "REQUIRED",
            fields: [
              {
                name: "name",
                type: "string",
                mode: "REQUIRED",
              },
            ],
          },
          {
            name: "ranking",
            type: "RECORD",
            mode: "REQUIRED",
            fields: [
              {
                name: "original",
                type: "STRING",
                mode: "REQUIRED",
              },
              {
                name: "normalized",
                type: "INTEGER",
                mode: "REQUIRED",
              },
            ],
          },
          {
            name: "threshold",
            type: "RECORD",
            mode: "NULLABLE",
            fields: [
              {
                name: "value",
                type: "INTEGER",
                mode: "NULLABLE",
              },
              {
                name: "isReached",
                type: "BOOL",
                mode: "NULLABLE",
              },
            ],
          },
        ],
      },
    },
  }
}
