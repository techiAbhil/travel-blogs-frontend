import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PaymentStatusModal from '../components/modals/PaymentStatusModal';

const getRazorpayOptions = (order) => ({
	key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Replace with your Razorpay key_id
	amount: order.amount,
	currency: order.currency,
	name: 'Geneka',
	description: 'Test Transaction',
	order_id: order.order_id, // This is the order_id created in the backend
	callback_url: `${import.meta.env.VITE_API_URL}app/verify`, // Your success URL
	prefill: {
		name: 'Bharat Mandlik',
		email: 'bharat@gmail.com',
		contact: '9999999999',
	},
	theme: {
		color: '#F37254',
	},
	// handler: function (response) {
	// 	console.log(response);
	// 	alert('Payment was successful');
	// },
});

const Booking = () => {
	const location = useLocation();
	const { blog } = location.state || {};

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [verificationStatus, setVerificationStatus] = useState('unknown');
	const navigate = useNavigate();

	const paymentVerify = async (response) => {
		try {
			console.log(response);
			await api.post('/app/verify', response);
			setVerificationStatus('success');
		} catch {
			setVerificationStatus('failure');
		}
	};

	const createOrder = async () => {
		try {
			setLoading(true);
			const { data } = await api.post(`/app/booking`, {
				blog_id: blog.blog_id,
			});
			setLoading(false);
			if (data.orderDetails) {
				const razorpayOptions = getRazorpayOptions(data.orderDetails);
				razorpayOptions.handler = paymentVerify;
				const paymentObject = new window.Razorpay(razorpayOptions);
				return paymentObject.open();
			}
			alert('failed to create an order');
		} catch (e) {
			setLoading(false);
			setError(e?.msg ?? 'There is an issue in creating order');
		}
	};

	const onPaymentStatusModalClose = () => {
		setVerificationStatus('unknown');
		navigate('/blogs');
	};

	if (!blog) {
		return (
			<div
				className="container"
				style={{ padding: '40px', textAlign: 'center' }}
			>
				<h2>No blog details found. Please go back and select a trip.</h2>
			</div>
		);
	}

	return (
		<div
			className="container"
			style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}
		>
			<div
				className="card glass"
				style={{
					padding: '40px',
					borderRadius: 'var(--radius)',
					textAlign: 'center',
					boxShadow: 'var(--shadow-md)',
				}}
			>
				<h1 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>
					Book your trip today to{' '}
					<span style={{ color: 'var(--primary)' }}>{blog.place_name}</span>
				</h1>

				<div
					style={{
						marginBottom: '32px',
						color: 'var(--text-secondary)',
						fontSize: '1.1rem',
					}}
				>
					<p>
						Experience the beauty of {blog.place_name} as described by{' '}
						{blog.users?.first_name}.
					</p>
				</div>
				{error && (
					<div
						style={{
							color: 'var(--primary)',
							marginBottom: '1rem',
							textAlign: 'center',
							fontSize: '0.9rem',
						}}
					>
						{error}
					</div>
				)}

				<button
					className="btn btn-primary"
					onClick={createOrder}
					style={{
						padding: '16px 32px',
						fontSize: '1.2rem',
						boxShadow: '0 4px 14px 0 rgba(255, 56, 92, 0.39)',
					}}
					disabled={loading}
				>
					{loading
						? 'Processing please wait!'
						: 'Pay Now & Confirm my seat today!'}
				</button>
			</div>
			<PaymentStatusModal
				isOpen={verificationStatus !== 'unknown'}
				onClose={onPaymentStatusModalClose}
				isPaymentSuccessful={verificationStatus === 'success'}
				place_name={blog.place_name}
			/>
		</div>
	);
};

export default Booking;
