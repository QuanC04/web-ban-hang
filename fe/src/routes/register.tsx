import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import SignupForm from '../pages/register'

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: SignupForm,
})

export default registerRoute
