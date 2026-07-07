import type { RegionRisk } from '@/features/dashboard/types';
import { sortRegionsByRisk } from '@/features/dashboard/model/adapters';
import { Panel } from '@/shared/ui/Panel/Panel';

import './RankingBoard.css';

type RankingBoardProps = {
  regions: RegionRisk[];
};

export function RankingBoard({ regions }: RankingBoardProps) {
  const ranked = sortRegionsByRisk(regions);

  return (
    <Panel title="重点区域风险排行" eyebrow="Risk Rank">
      <ol className="ranking-board" aria-label="重点区域风险排行">
        {ranked.map((region, index) => (
          <li key={region.id} className="ranking-board__item">
            <span className="ranking-board__index">{String(index + 1).padStart(2, '0')}</span>
            <div className="ranking-board__main">
              <div className="ranking-board__row">
                <strong>{region.name}</strong>
                <span>{region.riskScore}</span>
              </div>
              <div className="ranking-board__track">
                <span style={{ width: `${region.riskScore}%` }} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
