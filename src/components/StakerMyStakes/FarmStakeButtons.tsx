import React from 'react';
import { Box, Button } from 'theme/components';
import { useFarmingHandlers } from 'hooks/useStakerHandlers';
import { FarmingType } from 'models/enums';
import Loader from 'components/Loader';
import { useTranslation } from 'react-i18next';
import { useV3StakeData } from 'state/farms/hooks';

interface FarmCardDetailProps {
  el: any;
}

export default function FarmStakeButtons({ el }: FarmCardDetailProps) {
  const { t } = useTranslation();

  const { v3Stake } = useV3StakeData();
  const { txType, selectedTokenId, txConfirmed, txError, selectedFarmingType } =
    v3Stake ?? {};

  const { eternalCollectRewardHandler, withdrawHandler, claimRewardsHandler } =
    useFarmingHandlers() || {};

  return (
    <>
      {!el.eternalFarming && (
        <Button
          width='100%'
          disabled={
            selectedTokenId === el.id &&
            txType === 'withdraw' &&
            !txConfirmed &&
            !txError
          }
          onClick={() => {
            withdrawHandler(el.id);
          }}
        >
          {selectedTokenId === el.id &&
          txType === 'withdraw' &&
          !txConfirmed &&
          !txError ? (
            <>
              <Loader size={'1rem'} stroke={'var(--white)'} />
              <Box margin='0 0 0 5px'>
                <small>{t('withdrawing')}</small>
              </Box>
            </>
          ) : (
            <>
              <small>{t('withdraw')}</small>
            </>
          )}
        </Button>
      )}
      {el.eternalFarming && (
        <Box width='100%' className='flex justify-between'>
          <Button
            width='49%'
            disabled={
              (selectedTokenId === el.id &&
                txType === 'eternalCollectReward' &&
                !txConfirmed &&
                !txError) ||
              (el.eternalEarned == 0 && el.eternalBonusEarned == 0)
            }
            onClick={() => {
              eternalCollectRewardHandler(el.id, { ...el });
            }}
          >
            {selectedTokenId === el.id &&
            txType === 'eternalCollectReward' &&
            !txConfirmed &&
            !txError ? (
              <>
                <Loader size={'18px'} stroke={'var(--white)'} />
                <Box margin='0 0 0 5px'>
                  <small>{t('claiming')}</small>
                </Box>
              </>
            ) : (
              <small>{t('claim')}</small>
            )}
          </Button>
          <Button
            width='49%'
            disabled={
              selectedTokenId === el.id &&
              selectedFarmingType === FarmingType.ETERNAL &&
              txType === 'claimRewards' &&
              !txConfirmed &&
              !txError
            }
            onClick={() => {
              claimRewardsHandler(el.id, { ...el }, FarmingType.ETERNAL);
            }}
          >
            {selectedTokenId === el.id &&
            selectedFarmingType === FarmingType.ETERNAL &&
            txType === 'claimRewards' &&
            !txConfirmed &&
            !txError ? (
              <>
                <Loader size={'18px'} stroke={'var(--white)'} />
                <Box margin='0 0 0 5px'>
                  <small>{t('undepositing')}</small>
                </Box>
              </>
            ) : (
              <small>{t('undeposit')}</small>
            )}
          </Button>
        </Box>
      )}
    </>
  );
}
