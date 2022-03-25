import { Center, Container, propNames } from "@chakra-ui/react";

export interface SessionLayoutProps {
  children: React.ReactNode;
}
export function SessionLayout(props: SessionLayoutProps) {

  return (
    <div className="SessionLayout">
      <Center minHeight={'100vh'} width={'100%'}>
        <Container maxWidth={1024}>
          <div>{props.children}</div>
        </Container>
      </Center>
    </div>
  )
}