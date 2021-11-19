import { createCustomElement, actionTypes } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
const {COMPONENT_PROPERTY_CHANGED, COMPONENT_ERROR_THROWN} = actionTypes;

const demo_card = {
	title: 'Demo Title',
	secondary_title: 'Demo Secondary Title (Short Description)',
	icon: 'heart',
	sys_id: '1233456',
	fields: [
		{
			value: 'val_1',
			displayValue: 'Value One'
		},
		{
			value: 'val_2',
			displayValue: 'Value Two'
		},
		{
			value: 'val_3',
			displayValue: 'Value Three'
		}
	],
	tertiary_fields: [
		{
			value: 'author',
			displayValue: 'Andrea Cool Cat'
		}
	],
	actions: []
}

const view = (state, {dispatch, updateProperties}) => {
	const { emptyMessage, paginationWindowSize, columnClass, fieldColumnClass, items, currentPage, enablePagination, titleClass, pages, title } = state;

	function clickedCard(obj) {
		dispatch('CARD_CLICKED', { obj });
	}

	function buildCard(obj) {
		return (
			<div className='mfg-card' on-click={() => clickedCard(obj)}>
				<div className='mfg-card-heading'>
					<h3 className={`mfg-card-title ${titleClass}`}>{obj.title}</h3>
					<span className='mfg-card-secondary-title'>{obj.secondary_title}</span>
				</div>
				<div className='mfg-card-fields-container row'>
					{obj.fields &&
						obj.fields.map(field => {
							return (
								<div className={`mfg-card-field ${fieldColumnClass}`}>
									<span>{field.displayValue}</span>
								</div>
							)
						})
					}
				</div>
				<div className='mfg-card-tertiary-fields'>
					{obj.tertiary_fields &&
						obj.tertiary_fields.map(field => {
							return (
								<div className='mfg-card-tertiary-field'>
									<span>{field.displayValue}</span>
								</div>
							)
						})
					}
				</div>
			</div>
		)
	}

	function buildPaginationPages() {
		let results = [];
		for (let i = 0; i < pages; i++) {
			results.push(<div role='button' on-click={() => goTo(i)} className={`mfg-pagination-button ${currentPage == i && 'active'}`}>{i}</div>);
		}
		return results;
	}

	function goTo(page) {
		updateProperties({currentPage: page})
	}

	return (
		<div className='mfg-card-list'>
			<h3>{title}</h3>
			{
				!enablePagination 
					? 
						<div className='row'>
							{items && items.length > 0 &&
								items.map(item => {
									return (
										<div className={columnClass}>
											{buildCard(item)}
										</div>
									)
								}) 
							}
						</div>
					:
						<div className='row'>
							{items && items.length > 0 ?
								items.map((item, index) => {
									if ((index >= (currentPage * parseInt(paginationWindowSize))) && (index <= (currentPage * parseInt(paginationWindowSize)) + parseInt(paginationWindowSize) - 1)) {
										return (
											<div className={columnClass}>
												{buildCard(item)}
											</div>
										)
									}
								})
								:
								<div>
									<span>{emptyMessage}</span>
								</div>
							}
							{items && items.length > paginationWindowSize ?
							<div className='mfg-pagination col-md-12'>
								<div className='flex-row-between'>
									<div className='mfg-pagination-counter'>
										<span>{currentPage * parseInt(paginationWindowSize) + 1}-{items.length > currentPage * parseInt(paginationWindowSize) + parseInt(paginationWindowSize) ? currentPage * parseInt(paginationWindowSize) + parseInt(paginationWindowSize) : items.length} of {items.length}</span>
									</div>	
									<div className='flex-row'>
										{
											currentPage == 0
												?
													<div className='mfg-pagination-button disabled'><span className='left-chevron'></span></div>
												:
													<div role='button' on-click={() => goTo(currentPage - 1)} className='mfg-pagination-button'><span className='left-chevron'></span></div>
										}
											{buildPaginationPages()}
										{
											items.length > currentPage * parseInt(paginationWindowSize) + parseInt(paginationWindowSize)
												?
													<div role='button' on-click={() => goTo(currentPage + 1)} className='mfg-pagination-button'><span className='right-chevron'></span></div>
												:
													<div className='mfg-pagination-button disabled'><span className='right-chevron'></span></div>
										}
									</div>
								</div>
							</div>
							:
							<div></div>
							}
						</div>
				}
		</div>
	);
};

createCustomElement('snc-mfg-card-list', {
	renderer: {type: snabbdom},
	transformState(state) {
		const { properties } = state;
		return properties;
	},
	view,
	properties: {
		title: { default: 'Open Deviations' },
		items: { default: [] },
		columnClass: { default: 'col-md-6' },
		fieldColumnClass: { default: 'col-md-6' },
		paginationWindowSize: { default: 4 },
		enablePagination: { default: true },
		currentPage: { default: 0 },
		titleClass: { default: 'h4' },
		emptyMessage: { default: 'No Open Deviations' },
		pages: { computed({properties: {items, paginationWindowSize}}) {
			return Math.ceil(items.length / parseInt(paginationWindowSize))
		}}
	},
	actionHandlers: {
		[COMPONENT_PROPERTY_CHANGED]: ({action: {payload}, updateProperties}) => {
			if (payload.name == 'items')
				updateProperties({currentPage: 0});
    },
		[COMPONENT_ERROR_THROWN]: ({action: {payload}}) => {
      console.log(payload)
    }
	},
	styles
});
