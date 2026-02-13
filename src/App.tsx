import { ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/layout';
import PreLoginLayout from './components/pre-login-layout/pre-login-layout';
import AppContext from './hooks/app-context';
import useAppReducer from './hooks/app-reducer';
import AllPosts from './pages/allposts/all-posts';
import Dashboard from './pages/dashboard/dashboard';
import Login from './pages/login';
import Profile from './pages/profile/profile';
import Register from './pages/register';
import ProtectedRoute from './routes/protected-route';
import Theme from './theme';
import './utils/interceptor';
import EditPost from './pages/edit-post/edit-post';

function App() {
	const { appState, dispatch } = useAppReducer();
	return (
		<ThemeProvider theme={Theme}>
			<AppContext.Provider value={{ dispatch, appState }}>
				<BrowserRouter>
					<Routes>
						<Route path="/auth" element={<PreLoginLayout />}>
							<Route path="login" index element={<Login />} />
							<Route path="register" index element={<Register />} />
						</Route>
						<Route path="/" element={<Layout />}>
							<Route
								path="dashboard"
								element={
									<ProtectedRoute>
										<Dashboard />
									</ProtectedRoute>
								}
							/>
							<Route
								path="posts"
								element={
									<ProtectedRoute>
										<AllPosts />
									</ProtectedRoute>
								}
							/>
							<Route
								path="posts/update/:blog_id"
								element={
									<ProtectedRoute>
										<EditPost />
									</ProtectedRoute>
								}
							/>
							<Route
								path="profile"
								element={
									<ProtectedRoute>
										<Profile />
									</ProtectedRoute>
								}
							/>
						</Route>
					</Routes>
				</BrowserRouter>
			</AppContext.Provider>
		</ThemeProvider>
	);
}

export default App;
