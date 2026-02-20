import Modal from '../Modal';

const PaymentStatusModal = ({
	isOpen,
	onClose,
	isPaymentSuccessful,
	place_name,
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={isPaymentSuccessful ? 'Congratulations!' : 'So sorry!'}
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
					{isPaymentSuccessful
						? 'Yupeee!, your payment has been successful!'
						: 'There has been some issues with your payment'}
				</h1>

				{isPaymentSuccessful && (
					<div
						style={{
							marginBottom: '32px',
							color: 'var(--text-secondary)',
							fontSize: '1.1rem',
						}}
					>
						Have a wonderful experience to{' '}
						<span style={{ color: 'var(--primary)' }}>{place_name}</span>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default PaymentStatusModal;
