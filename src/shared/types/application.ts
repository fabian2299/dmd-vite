export interface Application {
  id: number
  name: string
  type: Type
  metadata: string
}

export enum Type {
  External = "External",
  GoAigua = "Go aigua",
}
