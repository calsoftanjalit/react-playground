import { Container, Title, Text, Button, Group } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { ExampleComponent, MantineExample } from './components/ExampleComponent'
import { QueryExample } from './components/QueryExample'
import './App.css'

function App() {
  const handleNotification = () => {
    notifications.show({
      title: 'Success!',
      message: 'This is a Mantine notification 🎉',
      color: 'blue',
    })
  }

  return (
    <Container size="lg" className="py-8">
      <div className="text-center mb-8">
        <Title order={1} className="mb-4">
          React Playground
        </Title>
        <Text size="lg" c="dimmed" className="mb-6">
          Vite + React + TypeScript + Mantine + TanStack Query + Tailwind CSS + SCSS
        </Text>
        
        <Group justify="center" className="mb-8">
          <Button 
            variant="filled" 
            size="md"
            onClick={handleNotification}
          >
            Show Notification
          </Button>
        </Group>
      </div>

      <div className="space-y-4">
        <ExampleComponent 
          title="SCSS Module Component"
          description="This component demonstrates SCSS modules with scoped styling"
        />

        <MantineExample />

        <QueryExample />
      </div>

      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <Text size="sm" c="dimmed" ta="center">
          🚀 Built with Vite • ⚛️ React • 📘 TypeScript • 🎨 Mantine • 🔄 TanStack Query • 💨 Tailwind • 🎭 SCSS
        </Text>
      </div>
    </Container>
  )
}

export default App
