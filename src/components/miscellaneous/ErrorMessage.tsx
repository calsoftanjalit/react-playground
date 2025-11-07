import { Text } from "@mantine/core";
import { ErrorMessageInterface } from "../../types/errorMessage";

const ErrorMessage: React.FC<ErrorMessageInterface> = ({
  message
}) => {
  return(
    <Text c="red">{message}</Text>
  )
}

export default ErrorMessage;