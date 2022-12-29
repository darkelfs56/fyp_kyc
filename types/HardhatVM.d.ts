export type HardhatVMError = {
  code: number
  data: {
    code: number
    message: string
  }
  message: string
  stack: string
}